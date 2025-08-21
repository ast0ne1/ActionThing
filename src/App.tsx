import React, { useEffect, useState } from 'react';
import { createDeskThing } from '@deskthing/client';
import { DEVICE_CLIENT } from '@deskthing/types';
import './index.css';

// Create DeskThing client instance
const DeskThing = createDeskThing();

interface ActionResponse {
  buttonId: number;
  status: number;
  statusText: string;
  response: string;
  success: boolean;
}

const App: React.FC = () => {
  const [currentSettings, setCurrentSettings] = useState<any>({});
  const [responses, setResponses] = useState<Record<number, ActionResponse>>({});
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Load settings from localStorage on startup (like working reference apps)
    try {
      const savedSettings = localStorage.getItem('actionthing-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setCurrentSettings((prev: any) => ({ ...prev, ...parsed }));
        console.log('ActionThing: Loaded settings from localStorage:', parsed);
      }
    } catch (error) {
      console.warn('ActionThing: Failed to load settings from localStorage:', error);
    }

    // Listen for settings updates from DeskThing
    const settingsListener = DeskThing.on(DEVICE_CLIENT.SETTINGS, (settings: any) => {
      console.log('ActionThing Client: Received settings:', settings);
      
      // Handle different possible data structures from DeskThing
      let settingsData = settings;
      if (settings && typeof settings === 'object') {
        if (settings.payload) {
          settingsData = settings.payload;
        } else if (settings.settings) {
          settingsData = settings.settings;
        }
      }
      
      if (settingsData && typeof settingsData === 'object') {
        setCurrentSettings(settingsData);
      }
    });

    // Get initial settings
    DeskThing.getSettings().then((settingsData) => {
      if (settingsData) {
        console.log('ActionThing Client: Received initial settings:', settingsData);
        setCurrentSettings(settingsData);
      }
    });

    // Listen for action responses
    const actionResponseListener = DeskThing.on('action-response', (response: any) => {
      console.log('ActionThing Client: Received action-response:', response);
      
      // Extract the actual response data from the payload
      let responseData = response;
      if (response && response.payload) {
        responseData = response.payload;
      }
      
      if (responseData && responseData.buttonId !== undefined) {
        setResponses(prev => ({
          ...prev,
          [responseData.buttonId]: responseData
        }));
      }
    });

    // Listen for logs and add them to local state for the right panel
    const logListener = DeskThing.on('log', (data: any) => {
      console.log('ActionThing Client: Received log event:', data);
      
      // Handle different possible data structures from DeskThing
      let logMessage = 'Unknown log message';
      if (typeof data === 'string') {
        logMessage = data;
      } else if (data && typeof data === 'object') {
        if (data.payload) {
          logMessage = data.payload;
        } else if (data.message) {
          logMessage = data.message;
        } else if (data.type === 'log' && data.payload) {
          logMessage = data.payload;
        } else {
          // Try to stringify the entire object for debugging
          try {
            logMessage = JSON.stringify(data);
          } catch (e) {
            logMessage = 'Complex object received';
          }
        }
      }
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${logMessage}`]);
    });

    // Listen for errors and add them to local state for the right panel
    const errorListener = DeskThing.on('error', (data: any) => {
      console.log('ActionThing Client: Received error event:', data);
      // Handle different possible data structures from DeskThing
      let errorMessage = 'Unknown error';
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data && typeof data === 'object') {
        if (data.payload) {
          errorMessage = data.payload;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.type === 'error' && data.payload) {
          errorMessage = data.payload;
        }
      }
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-19), `[${timestamp}] ERROR: ${errorMessage}`]);
    });

    return () => {
      // Clean up listeners
      settingsListener();
      actionResponseListener();
      logListener();
      errorListener();
    };
  }, []);

  // Get individual button settings - generate for 6 buttons (mobile-friendly)
  const backgroundColor = currentSettings.backgroundColor?.value || '#1f2937';
  
  const defaultColors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"
  ];
  
  const buttons = Array.from({ length: 6 }, (_, index) => {
    const id = index + 1;
    const enabledKey = `button${id}Enabled`;
    const labelKey = `button${id}Label`;
    const colorKey = `button${id}Color`;
    
    return {
      id,
      enabled: currentSettings[enabledKey]?.value === true,
      label: currentSettings[labelKey]?.value || `Action ${id}`,
      color: currentSettings[colorKey]?.value || defaultColors[index],
      response: responses[id]
    };
  });

  const enabledButtons = buttons.filter(button => button.enabled);
  
  // Button trigger handler - defined after buttons array
  const handleButtonTrigger = (buttonId: number) => {
    console.log('ActionThing: Button clicked:', buttonId);
    const button = buttons.find(b => b.id === buttonId);
    console.log('ActionThing: Found button:', button);
    if (button && button.enabled) {
      console.log('ActionThing: Button is enabled, proceeding with trigger');
      const url = currentSettings[`button${buttonId}Url`]?.value || 'https://httpbin.org/post';
      const label = button.label;
      
      // Get HTTP configuration settings for this button
      const method = currentSettings[`button${buttonId}Method`]?.value || 'POST';
      const authType = currentSettings[`button${buttonId}Auth`]?.value || 'none';
      const authToken = currentSettings[`button${buttonId}Token`]?.value || '';
      const customPayload = currentSettings[`button${buttonId}Payload`]?.value || '';
      const customHeaders = currentSettings[`button${buttonId}Headers`]?.value || '';
      
      console.log('ActionThing: Sending trigger for button:', buttonId, 'with config:', { url, label, method, authType });
      console.log('ActionThing: Full payload being sent:', { 
        buttonId, 
        url, 
        label,
        method,
        authType,
        authToken,
        customPayload,
        customHeaders
      });
      
      // Send data to server using DeskThing client
      DeskThing.send({ 
        type: 'trigger-action', 
        payload: { 
          buttonId, 
          url, 
          label,
          method,
          authType,
          authToken,
          customPayload,
          customHeaders
        }
      });
    } else {
      console.log('ActionThing: Button not found or not enabled:', { buttonId, button, enabled: button?.enabled });
    }
  };

  // Close panel when clicking outside or pressing Escape
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Check if the click target is a button or interactive element
      const target = event.target as HTMLElement;
      
      console.log('ActionThing: Global click detected on:', target.tagName, target.className, target);
      
      // If clicking on a button or any interactive element, don't toggle panel
      if (target.tagName === 'BUTTON' || 
          target.closest('button') || 
          target.closest('input') || 
          target.closest('select') ||
          target.closest('.action-button')) {
        console.log('ActionThing: Click on interactive element detected, not toggling panel');
        return;
      }
      
      const clientX = event.clientX;
      const isRightSide = clientX > window.innerWidth / 2;
      
      if (isRightSide) {
        console.log('ActionThing: Right side click detected, toggling panel');
        // Right side clicked - toggle right panel (only if not clicking on interactive elements)
        setShowRightPanel(prev => !prev);
      }
      // Left side clicks don't do anything for now
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowRightPanel(false);
      }
    };

    window.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden" style={{ backgroundColor }}>
      {/* Main Content Area */}
      <div className="w-full h-full p-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 app-header">
          <h1 className="text-4xl font-bold text-white mb-2">⚡ ActionThing</h1>
          <p className="text-gray-400 text-lg">
            {enabledButtons.length > 0 
              ? `${enabledButtons.length} action button${enabledButtons.length > 1 ? 's' : ''} ready to trigger`
              : 'Your customizable webhook dashboard'
            }
          </p>
          {enabledButtons.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              💡 Click any enabled button to trigger its configured action
            </div>
          )}
          {enabledButtons.length === 0 && (
            <div className="mt-2 text-sm text-gray-500">
              💡 Enable buttons in Settings → Apps → ActionThing to get started
            </div>
          )}
        </div>

        {/* Button Grid */}
        {enabledButtons.length > 0 ? (
          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 justify-center items-center max-w-4xl mx-auto"
               style={{
                 gridTemplateColumns: enabledButtons.length <= 2 
                   ? 'repeat(2, 1fr)'
                   : enabledButtons.length <= 4
                   ? 'repeat(2, 1fr)'
                   : 'repeat(3, 1fr)'
               }}>
            {enabledButtons.map(button => (
              <div key={button.id} className="relative group">
                <button
                  onClick={() => {
                    console.log('ActionThing: Button', button.id, 'clicked directly');
                    handleButtonTrigger(button.id);
                  }}
                  className={`
                    action-button w-full min-w-[160px] sm:min-w-[180px] max-w-[220px] px-6 sm:px-8 py-5 sm:py-6 rounded-xl text-white font-bold text-base sm:text-lg
                    ${button.response?.success === true ? 'status-success' : ''}
                    ${button.response?.success === false ? 'status-error' : ''}
                  `}
                  style={{ backgroundColor: button.color }}
                  title={`Trigger ${button.label} - Button ${button.id}`}
                >
                  <div className="truncate button-label">{button.label}</div>
                </button>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state flex flex-col items-center justify-center h-64">
            <div className="text-6xl mb-4">⚡</div>
            <div className="text-xl text-gray-300 mb-4">No Action Buttons Enabled</div>
            <div className="text-gray-400 text-center max-w-md">
              Enable and configure your action buttons in<br />
              <span className="font-semibold text-blue-400">Settings → Apps → ActionThing</span>
            </div>
            <div className="mt-6 text-sm text-gray-500 text-center">
              💡 <strong>Quick Start:</strong> Enable Button 1, set a label and URL, then click to trigger!
            </div>
          </div>
        )}
      </div>

      {/* Panel Toggle Areas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Right side edge is clickable for panel toggle - make it very narrow */}
        <div className="absolute right-0 top-0 w-8 h-full pointer-events-auto">
          {/* Visual indicator that right edge is clickable */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-20 hover:opacity-40 transition-opacity">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Activity Log */}
      <div className={`${showRightPanel ? 'panel' : ''} right-panel`}>
        <div className={`panel-container fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          showRightPanel ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="panel-content p-3 sm:p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-gray-900 pb-2">
              <h2 className="text-xl sm:text-2xl font-bold">📋 Activity Log</h2>
            </div>
            
            {/* Logs Content - Takes remaining space */}
            <div className="flex-1 overflow-y-auto">
              {logs.length > 0 ? (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-gray-300 text-sm p-3 bg-gray-700 rounded border-l-4 border-gray-600">
                      <span className="break-words">{log}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center py-8">
                  No activity yet. Try triggering a button!
                </div>
              )}
            </div>
            
            {/* Clear Button - Always at bottom */}
            {logs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => setLogs([])}
                  className="w-full text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 rounded border border-gray-600 hover:border-gray-500 hover:bg-gray-700"
                >
                  Clear Logs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
