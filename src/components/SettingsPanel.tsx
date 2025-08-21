import React, { useState } from 'react';
import type { ActionThingSettings, ActionButton } from '../types/action';
import { HTTP_METHODS, AUTH_TYPES, DEFAULT_COLORS } from '../types/action';

interface SettingsPanelProps {
  settings: ActionThingSettings;
  onSave: (settings: ActionThingSettings) => void;
  onClose: () => void;
  onDeleteButton: (buttonId: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSave,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<ActionThingSettings>(settings);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(settings.selectedButtonIndex);

  const selectedButton = localSettings.buttons[selectedButtonIndex];

  const handleSave = () => {
    onSave({
      ...localSettings,
      selectedButtonIndex
    });
    onClose();
  };

  const handleGeneralSettingChange = (key: keyof ActionThingSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleButtonChange = (updates: Partial<ActionButton>) => {
    setLocalSettings(prev => ({
      ...prev,
      buttons: prev.buttons.map((button, index) =>
        index === selectedButtonIndex ? { ...button, ...updates } : button
      )
    }));
  };

  const handleHeaderChange = (key: string, value: string) => {
    const newHeaders = { ...selectedButton.headers };
    if (value) {
      newHeaders[key] = value;
    } else {
      delete newHeaders[key];
    }
    handleButtonChange({ headers: newHeaders });
  };

  const addHeader = () => {
    const key = prompt('Header name:');
    if (key && !selectedButton.headers[key]) {
      handleHeaderChange(key, '');
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...selectedButton.headers };
    delete newHeaders[key];
    handleButtonChange({ headers: newHeaders });
  };

  const testPayload = () => {
    try {
      if (selectedButton.payload) {
        JSON.parse(selectedButton.payload);
        alert('Payload JSON is valid!');
      }
    } catch (error) {
      alert('Invalid JSON in payload: ' + (error as Error).message);
    }
  };

  const resetButtonToDefaults = () => {
    if (confirm(`Reset Button ${selectedButtonIndex + 1} to default settings?`)) {
      const defaultButton = localSettings.buttons.find(b => b.id === (selectedButtonIndex + 1).toString());
      if (defaultButton) {
        handleButtonChange({
          label: `Action ${selectedButtonIndex + 1}`,
          url: 'https://httpbin.org/post',
          payload: `{"message": "Action ${selectedButtonIndex + 1} triggered", "buttonId": ${selectedButtonIndex + 1}}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          authType: 'none',
          authToken: '',
          authUsername: '',
          authPassword: ''
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden settings-panel">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">ActionThing Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-8">
          {/* Button Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Select Button to Configure
            </label>
            <select
              value={selectedButtonIndex}
              onChange={(e) => setSelectedButtonIndex(parseInt(e.target.value))}
              className="border rounded-lg px-4 py-3 text-lg font-medium w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {localSettings.buttons.map((button, index) => (
                <option key={button.id} value={index}>
                  Button {index + 1}: {button.label} {button.enabled ? '(Enabled)' : '(Disabled)'}
                </option>
              ))}
            </select>
          </div>

          {/* Button Configuration */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Button {selectedButtonIndex + 1} Configuration
              </h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedButton.enabled}
                    onChange={(e) => handleButtonChange({ enabled: e.target.checked })}
                    className="rounded"
                  />
                  <span className="font-medium text-gray-700">Enabled</span>
                </label>
                <button
                  onClick={resetButtonToDefaults}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Reset to Default
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Settings</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={selectedButton.label}
                    onChange={(e) => handleButtonChange({ label: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter button label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type
                  </label>
                  <select
                    value={selectedButton.method}
                    onChange={(e) => handleButtonChange({ method: e.target.value as 'POST' | 'PUT' })}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {HTTP_METHODS.map(method => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={selectedButton.url}
                    onChange={(e) => handleButtonChange({ url: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/webhook"
                  />
                </div>

                {/* Appearance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={selectedButton.backgroundColor}
                      onChange={(e) => handleButtonChange({ backgroundColor: e.target.value })}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_COLORS.map(color => (
                        <button
                          key={color.value}
                          onClick={() => handleButtonChange({ backgroundColor: color.value })}
                          className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Configuration */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Request Configuration</h4>

                {/* Authentication */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authentication
                  </label>
                  <select
                    value={selectedButton.authType}
                    onChange={(e) => handleButtonChange({ authType: e.target.value as any })}
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                  >
                    {AUTH_TYPES.map(auth => (
                      <option key={auth.value} value={auth.value}>
                        {auth.label}
                      </option>
                    ))}
                  </select>

                  {selectedButton.authType === 'bearer' && (
                    <input
                      type="password"
                      value={selectedButton.authToken}
                      onChange={(e) => handleButtonChange({ authToken: e.target.value })}
                      className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bearer token"
                    />
                  )}

                  {selectedButton.authType === 'basic' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={selectedButton.authUsername}
                        onChange={(e) => handleButtonChange({ authUsername: e.target.value })}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Username"
                      />
                      <input
                        type="password"
                        value={selectedButton.authPassword}
                        onChange={(e) => handleButtonChange({ authPassword: e.target.value })}
                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Password"
                      />
                    </div>
                  )}
                </div>

                {/* Headers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Headers
                    </label>
                    <button
                      onClick={addHeader}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Header
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                    {Object.entries(selectedButton.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={key}
                          onChange={(e) => {
                            const newHeaders = { ...selectedButton.headers };
                            delete newHeaders[key];
                            if (e.target.value) {
                              newHeaders[e.target.value] = value;
                            }
                            handleButtonChange({ headers: newHeaders });
                          }}
                          className="border rounded px-2 py-1 text-sm flex-1"
                          placeholder="Header name"
                        />
                        <span className="text-gray-500">:</span>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleHeaderChange(key, e.target.value)}
                          className="border rounded px-2 py-1 text-sm flex-1"
                          placeholder="Header value"
                        />
                        <button
                          onClick={() => removeHeader(key)}
                          className="text-red-600 hover:text-red-800 w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {Object.keys(selectedButton.headers).length === 0 && (
                      <div className="text-gray-500 text-sm text-center py-2">
                        No headers configured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body/Payload */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Request Body (JSON)
                </label>
                <button
                  onClick={testPayload}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Validate JSON
                </button>
              </div>
              <textarea
                value={selectedButton.payload}
                onChange={(e) => handleButtonChange({ payload: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder='{"key": "value", "message": "Hello World"}'
              />
            </div>

            {/* Button Preview */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="flex items-center space-x-4">
                <div
                  className="inline-block px-4 py-2 rounded-lg text-sm font-semibold shadow-md relative"
                  style={{
                    backgroundColor: selectedButton.backgroundColor,
                    color: selectedButton.textColor,
                    opacity: selectedButton.enabled ? 1 : 0.5
                  }}
                >
                  <div className="button-number">{selectedButtonIndex + 1}</div>
                  {selectedButton.label}
                  <div className="text-xs opacity-70 mt-1">
                    {selectedButton.method}
                  </div>
                </div>
                <span className="text-sm text-gray-600">
                  {selectedButton.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Global Settings */}
          <div className="border rounded-lg p-6 bg-blue-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Global Settings</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleGeneralSettingChange('backgroundColor', e.target.value)}
                      className="w-12 h-8 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={localSettings.backgroundColor}
                      onChange={(e) => handleGeneralSettingChange('backgroundColor', e.target.value)}
                      className="border rounded px-3 py-2 text-sm flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.showResponse}
                      onChange={(e) => handleGeneralSettingChange('showResponse', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Response Messages</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={localSettings.responseTimeout}
                    onChange={(e) => handleGeneralSettingChange('responseTimeout', parseInt(e.target.value))}
                    min="1000"
                    max="30000"
                    step="1000"
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.gridSnap}
                      onChange={(e) => handleGeneralSettingChange('gridSnap', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Grid Snap</span>
                  </label>
                  {localSettings.gridSnap && (
                    <input
                      type="number"
                      value={localSettings.gridSize}
                      onChange={(e) => handleGeneralSettingChange('gridSize', parseInt(e.target.value))}
                      min="10"
                      max="50"
                      className="border rounded px-3 py-2 w-20 ml-6 mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;