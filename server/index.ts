import { DeskThing } from '@deskthing/server';
import { DESKTHING_EVENTS } from '@deskthing/types';
import type { ActionThingSettings } from '../src/types/action';
import { defaultSettings } from '../src/types/action';
import { setupSettings, ActionThingSettingIDs } from './setupSettings';

// Define the structure for trigger action events
interface TriggerActionData {
  buttonId: number;
  url?: string;
  label?: string;
  payload?: any;
  method?: string;
  authType?: string;
  authToken?: string;
  customPayload?: string;
  customHeaders?: string;
}

const start = async (): Promise<void> => {
  try {
    // Initialize settings first - this is critical for global settings to appear
    const settingsResult = setupSettings();
    
    if (settingsResult.success) {
      console.log('ActionThing Server: Settings initialized successfully');
    }

    // Handle button trigger requests from client
    DeskThing.on('trigger-action', async (data: TriggerActionData) => {
      console.log('ActionThing Server: Received trigger-action event:', data);
      
      // Extract payload from the event structure
      const payload = data.payload || data;
      const buttonId = payload.buttonId;
      const url = payload.url || 'https://httpbin.org/post';
      const label = payload.label || `Action ${buttonId}`;

      if (!buttonId) {
        DeskThing.send({
          type: 'error',
          payload: 'Missing buttonId in trigger action data'
        });
        return;
      }

      try {
        // Get the configured HTTP settings for this button from the payload
        const method = payload.method || 'POST';
        const authType = payload.authType || 'none';
        const authToken = payload.authToken || '';
        const customPayload = payload.customPayload || '';
        const customHeaders = payload.customHeaders || '';
        
        console.log('ActionThing Server: HTTP config received:', {
          method,
          authType,
          authToken: authToken ? '***' : '',
          customPayload,
          customHeaders
        });
        
        // Build headers based on configuration
        let headers: Record<string, string> = {};
        
        // Parse custom headers if provided
        if (customHeaders) {
          try {
            const parsedHeaders = JSON.parse(customHeaders);
            headers = { ...headers, ...parsedHeaders };
          } catch (e) {
            console.warn('ActionThing Server: Invalid custom headers JSON, using defaults');
          }
        }
        
        // Add Content-Type if not specified
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
        
        // Add authentication headers
        if (authType === 'bearer' && authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        } else if (authType === 'basic' && authToken) {
          headers['Authorization'] = `Basic ${btoa(authToken)}`;
        }
        
        // Build request body
        let body: string | undefined;
        if (method !== 'GET' && method !== 'HEAD') {
          if (customPayload && customPayload.trim() !== '') {
            // Use custom payload if provided (it's already a string from settings)
            body = customPayload;
            console.log('ActionThing Server: Using custom payload:', customPayload);
          } else {
            // Use default payload
            body = JSON.stringify({
              message: `${label} triggered`,
              buttonId: buttonId,
              timestamp: new Date().toISOString()
            });
            console.log('ActionThing Server: Using default payload');
          }
        }
        
        const requestOptions: RequestInit = {
          method: method,
          headers: headers,
          body: body
        };

        DeskThing.send({
          type: 'log',
          payload: `Triggering: ${label}`
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        console.log('ActionThing Server: Sending HTTP request to:', url);
        
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });

        console.log('ActionThing Server: HTTP response received:', response.status, response.statusText);

        clearTimeout(timeoutId);

        const responseText = await response.text();
        
        // Send action response with proper structure
        const actionResponse = {
          buttonId: buttonId,
          status: response.status,
          statusText: response.statusText,
          response: responseText,
          success: response.ok
        };
        
        console.log('ActionThing Server: Sending action-response:', actionResponse);
        
        DeskThing.send({
          type: 'action-response',
          payload: actionResponse
        });

        DeskThing.send({
          type: 'log',
          payload: `${label} completed - ${response.status}`
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        console.log('ActionThing Server: Error occurred:', errorMessage);
        
        DeskThing.send({
          type: 'error',
          payload: `Failed to execute action: ${errorMessage}`
        });

        // Send error action response with proper structure
        const errorResponse = {
          buttonId: buttonId,
          status: 0,
          statusText: 'Error',
          response: errorMessage,
          success: false
        };
        
        console.log('ActionThing Server: Sending error action-response:', errorResponse);
        
        DeskThing.send({
          type: 'action-response',
          payload: errorResponse
        });
      }
    });

    // Settings are now handled directly by the client via @deskthing/client
    // No need for server-side settings forwarding

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during initialization';
    DeskThing.send({ 
      app: 'actionthing', 
      type: 'error', 
      payload: `Failed to initialize ActionThing: ${errorMessage}` 
    });
    throw error;
  }
};

const stop = async (): Promise<void> => {
  // Cleanup any resources if needed
};

// Register event listeners
DeskThing.on(DESKTHING_EVENTS.START, start);
DeskThing.on(DESKTHING_EVENTS.STOP, stop);

// Export the start and stop functions
export { start, stop };
