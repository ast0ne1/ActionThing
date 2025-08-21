// ActionThing Settings Structure - matches the global panel settings
export interface ActionThingSettings {
  backgroundColor: string;
  button1Enabled: boolean;
  button1Label: string;
  button1Url: string;
  button1Color: string;
  button2Enabled: boolean;
  button2Label: string;
  button2Url: string;
  button2Color: string;
  button3Enabled: boolean;
  button3Label: string;
  button3Url: string;
  button3Color: string;
  button4Enabled: boolean;
  button4Label: string;
  button4Url: string;
  button4Color: string;
  button5Enabled: boolean;
  button5Label: string;
  button5Url: string;
  button5Color: string;
  button6Enabled: boolean;
  button6Label: string;
  button6Url: string;
  button6Color: string;
  button7Enabled: boolean;
  button7Label: string;
  button7Url: string;
  button7Color: string;
  button8Enabled: boolean;
  button8Label: string;
  button8Url: string;
  button8Color: string;
  button9Enabled: boolean;
  button9Label: string;
  button9Url: string;
  button9Color: string;
  button10Enabled: boolean;
  button10Label: string;
  button10Url: string;
  button10Color: string;
}

// Button interface for UI rendering
export interface ActionButton {
  id: number;
  enabled: boolean;
  label: string;
  color: string;
  response?: ActionResponse;
}

// Response interface for button actions
export interface ActionResponse {
  buttonId: number;
  status: number;
  statusText: string;
  response: string;
  success: boolean;
}
// Default colors for buttons
export const defaultColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6b7280"
];

// Default settings - these will be overridden by DeskThing global panel
export const defaultSettings: ActionThingSettings = {
  backgroundColor: '#1f2937',
  button1Enabled: false,
  button1Label: 'Action 1',
  button1Url: 'https://httpbin.org/post',
  button1Color: '#3b82f6',
  button2Enabled: false,
  button2Label: 'Action 2',
  button2Url: 'https://httpbin.org/post',
  button2Color: '#10b981',
  button3Enabled: false,
  button3Label: 'Action 3',
  button3Url: 'https://httpbin.org/post',
  button3Color: '#f59e0b',
  button4Enabled: false,
  button4Label: 'Action 4',
  button4Url: 'https://httpbin.org/post',
  button4Color: '#ef4444',
  button5Enabled: false,
  button5Label: 'Action 5',
  button5Url: 'https://httpbin.org/post',
  button5Color: '#8b5cf6',
  button6Enabled: false,
  button6Label: 'Action 6',
  button6Url: 'https://httpbin.org/post',
  button6Color: '#06b6d4',
  button7Enabled: false,
  button7Label: 'Action 7',
  button7Url: 'https://httpbin.org/post',
  button7Color: '#f97316',
  button8Enabled: false,
  button8Label: 'Action 8',
  button8Url: 'https://httpbin.org/post',
  button8Color: '#84cc16',
  button9Enabled: false,
  button9Label: 'Action 9',
  button9Url: 'https://httpbin.org/post',
  button9Color: '#ec4899',
  button10Enabled: false,
  button10Label: 'Action 10',
  button10Url: 'https://httpbin.org/post',
  button10Color: '#6b7280'
};

