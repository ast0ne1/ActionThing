import { DeskThing } from '@deskthing/server';
import { DESKTHING_EVENTS, SETTING_TYPES } from '@deskthing/types';

// Generate setting IDs programmatically for 6 buttons (mobile-friendly)
const generateButtonSettingIDs = () => {
  const ids: any = {
    BACKGROUND_COLOR: 'backgroundColor'
  };
  
  // Generate IDs for 6 buttons
  for (let i = 1; i <= 6; i++) {
    ids[`BUTTON_${i}_ENABLED`] = `button${i}Enabled`;
    ids[`BUTTON_${i}_LABEL`] = `button${i}Label`;
    ids[`BUTTON_${i}_URL`] = `button${i}Url`;
    ids[`BUTTON_${i}_METHOD`] = `button${i}Method`;
    ids[`BUTTON_${i}_AUTH`] = `button${i}Auth`;
    ids[`BUTTON_${i}_TOKEN`] = `button${i}Token`;
    ids[`BUTTON_${i}_PAYLOAD`] = `button${i}Payload`;
    ids[`BUTTON_${i}_HEADERS`] = `button${i}Headers`;
    ids[`BUTTON_${i}_COLOR`] = `button${i}Color`;
  }
  
  return ids;
};

export const ActionThingSettingIDs = generateButtonSettingIDs();

// Generate default settings for 6 buttons (mobile-friendly)
const generateDefaultSettings = () => {
  const defaults: any = {
    [ActionThingSettingIDs.BACKGROUND_COLOR]: "#1f2937"
  };
  
  // Nice color palette for 6 buttons
  const buttonColors = [
    "#3b82f6", // Blue
    "#10b981", // Green  
    "#f59e0b", // Orange
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4"  // Cyan
  ];
  
  // Generate defaults for 6 buttons
  for (let i = 1; i <= 6; i++) {
    defaults[ActionThingSettingIDs[`BUTTON_${i}_ENABLED`]] = false;
    defaults[ActionThingSettingIDs[`BUTTON_${i}_LABEL`]] = `Action ${i}`;
    defaults[ActionThingSettingIDs[`BUTTON_${i}_URL`]] = 'https://httpbin.org/post';
    defaults[ActionThingSettingIDs[`BUTTON_${i}_METHOD`]] = 'POST';
    defaults[ActionThingSettingIDs[`BUTTON_${i}_AUTH`]] = 'none';
    defaults[ActionThingSettingIDs[`BUTTON_${i}_TOKEN`]] = '';
    defaults[ActionThingSettingIDs[`BUTTON_${i}_PAYLOAD`]] = `{"message": "Action ${i} triggered"}`;
    defaults[ActionThingSettingIDs[`BUTTON_${i}_HEADERS`]] = '{"Content-Type": "application/json"}';
    defaults[ActionThingSettingIDs[`BUTTON_${i}_COLOR`]] = buttonColors[i - 1];
  }
  
  return defaults;
};

const defaultSettings = generateDefaultSettings();

export function setupSettings() {
  try {
    // Generate settings structure programmatically for better organization
    const generateDeskThingSettings = () => {
      const settings: any = {};
      
      // Global app settings (always visible)
      settings[ActionThingSettingIDs.BACKGROUND_COLOR] = {
        id: ActionThingSettingIDs.BACKGROUND_COLOR,
        type: SETTING_TYPES.COLOR,
        label: "🎨 Background Color",
        description: "Background color for ActionThing interface",
        value: defaultSettings[ActionThingSettingIDs.BACKGROUND_COLOR]
      };
      
     
      // Show settings for ALL buttons - DeskThing will display them all
      // Users can use the buttonSelector as a visual guide
      for (let i = 1; i <= 6; i++) {
        const enabledId = ActionThingSettingIDs[`BUTTON_${i}_ENABLED`];
        const labelId = ActionThingSettingIDs[`BUTTON_${i}_LABEL`];
        const urlId = ActionThingSettingIDs[`BUTTON_${i}_URL`];
        const colorId = ActionThingSettingIDs[`BUTTON_${i}_COLOR`];
        const methodId = ActionThingSettingIDs[`BUTTON_${i}_METHOD`];
        const authId = ActionThingSettingIDs[`BUTTON_${i}_AUTH`];
        const tokenId = ActionThingSettingIDs[`BUTTON_${i}_TOKEN`];
        const payloadId = ActionThingSettingIDs[`BUTTON_${i}_PAYLOAD`];
        const headersId = ActionThingSettingIDs[`BUTTON_${i}_HEADERS`];
        
        // Enabled toggle
        settings[enabledId] = {
          id: enabledId,
          type: SETTING_TYPES.BOOLEAN,
          label: `🔘 Enable Button ${i}`,
          description: `Enable or disable action button ${i}`,
          value: defaultSettings[enabledId]
        };
        
        // Label
        settings[labelId] = {
          id: labelId,
          type: SETTING_TYPES.STRING,
          label: `📝 Button ${i} Label`,
          description: `Text displayed on button ${i}`,
          value: defaultSettings[labelId]
        };
        
        // URL
        settings[urlId] = {
          id: urlId,
          type: SETTING_TYPES.STRING,
          label: `🌐 Button ${i} URL`,
          description: `Target webhook/API endpoint for button ${i}`,
          value: defaultSettings[urlId]
        };
        
        // Color
        settings[colorId] = {
          id: colorId,
          type: SETTING_TYPES.COLOR,
          label: `🎨 Button ${i} Color`,
          description: `Background color for button ${i}`,
          value: defaultSettings[colorId]
        };
        
        // HTTP Method
        settings[methodId] = {
          id: methodId,
          type: SETTING_TYPES.SELECT,
          label: `📡 Button ${i} HTTP Method`,
          description: `HTTP method for button ${i} request`,
          value: defaultSettings[methodId],
          options: [
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'PATCH', label: 'PATCH' },
            { value: 'DELETE', label: 'DELETE' }
          ]
        };
        
        // Authentication Type
        settings[authId] = {
          id: authId,
          type: SETTING_TYPES.SELECT,
          label: `🔐 Button ${i} Authentication`,
          description: `Authentication type for button ${i}`,
          value: defaultSettings[authId],
          options: [
            { value: 'none', label: 'None' },
            { value: 'bearer', label: 'Bearer Token' },
            { value: 'basic', label: 'Basic Auth' }
          ]
        };
        
        // Authentication Token/Password
        settings[tokenId] = {
          id: tokenId,
          type: SETTING_TYPES.STRING,
          label: `🔑 Button ${i} Auth Token/Password`,
          description: `Authentication token or password for button ${i}`,
          value: defaultSettings[tokenId]
        };
        
        // Custom Payload
        settings[payloadId] = {
          id: payloadId,
          type: SETTING_TYPES.STRING,
          label: `📦 Button ${i} Custom Payload`,
          description: `Custom JSON payload for button ${i} (leave empty for default)`,
          value: defaultSettings[payloadId]
        };
        
        // Custom Headers
        settings[headersId] = {
          id: headersId,
          type: SETTING_TYPES.STRING,
          label: `📋 Button ${i} Custom Headers`,
          description: `Custom JSON headers for button ${i} (leave empty for default)`,
          value: defaultSettings[headersId]
        };
      }
      
      return settings;
    };

    const deskThingSettings = generateDeskThingSettings();

    // Initialize settings with DeskThing using the correct structure
    const result = DeskThing.initSettings(deskThingSettings as any);
    
    // Settings are handled directly by the client via window.DeskThing.on('settings')
    // No server-side settings forwarding needed (like FlowThing)
    
    return {
      success: true,
      settings: deskThingSettings,
      defaultSettings: defaultSettings
    };
  } catch (error) {
    console.error('[ActionThing] Error initializing settings:', error);
    throw error;
  }
}