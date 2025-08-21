# ⚡ ActionThing

A customizable webhook trigger app for DeskThing that allows you to create up to 6 configurable action buttons to send HTTP requests to external services, APIs, and automation platforms.

Vibe coded with Cursor based on Riprod's DeskThing app template.

## Features

### 🎯 **Core Functionality**
- **6 Configurable Buttons** - Enable/disable and customize up to 6 action buttons
- **Custom Labels** - Add personalized labels that display prominently on each button
- **HTTP Requests** - Send POST/PUT requests to any URL endpoint
- **Centralized Configuration** - Single settings panel with dropdown button selection

### 🔐 **Authentication Support**
- **No Authentication** - For public endpoints
- **Bearer Token** - For API key authentication
- **Basic Auth** - Username/password authentication

### 🎨 **Visual Customization**
- **Custom Colors** - Color picker options
- **Button Labels** - Clear text labels for each button

### 📡 **Request Configuration**
- **Custom Headers** - Add/remove HTTP headers as needed
- **JSON Payloads** - Configure request bodies with JSON validation
- **Response Feedback** - Visual success/error indicators
- **Activity Logging** - Real-time request monitoring

## Installation

1. Download or clone the ActionThing app
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the app:
   ```bash
   npm run build
   ```
4. Install in DeskThing using the generated package

## Usage

### Initial Setup

1. Open ActionThing in DeskThing
2. Click **"Configure Actions"** to open the settings panel
3. Select a button (1-10) from the dropdown menu
4. Enable the button and configure its settings

### Button Configuration

For each button, you can configure:

- **Label** - Display name shown on the button
- **Request Type** - POST or PUT HTTP method
- **URL** - Target endpoint (webhook, API, etc.)
- **Authentication** - Choose authentication method:
  - None
  - Bearer Token (enter your API key)
  - Basic Auth (username/password)
- **Headers** - Custom HTTP headers
- **Request Body** - JSON payload for the request
- **Button Color** - Visual customization

### Using Action Buttons

- **Single Click** - Trigger the configured HTTP request
- **Double Click** - Open configuration panel

### Response Feedback
- **Logs** - Detailed request history in right panel

## Use Cases

### 🏠 **Home Automation**
- Control smart devices via webhooks
- Trigger scenes and automations
- Integration with Home Assistant, OpenHAB

### ⚡ **Power Automate & Zapier**
- Trigger Microsoft Power Automate flows
- Activate Zapier workflows
- Custom business process automation

### 🔧 **API Testing & Development**
- Quick API endpoint testing
- Webhook payload validation
- Development workflow triggers

### 🎮 **Streaming & Content Creation**
- OBS scene switching
- Stream alerts and notifications
- Chat bot commands

### 📱 **IoT & Device Control**
- Arduino/Raspberry Pi triggers
- Custom device endpoints
- Sensor data collection

## Configuration Examples

### Power Automate Flow
```
Label: Start Weekly Report
Method: POST
URL: https://prod-xx.eastus.logic.azure.com/workflows/.../triggers/manual/paths/invoke
Headers: Content-Type: application/json
Body: {"reportType": "weekly", "department": "sales"}
Auth: None
```

### Home Assistant Automation
```
Label: Good Night Scene
Method: POST
URL: http://homeassistant.local:8123/api/webhook/goodnight
Headers: Authorization: Bearer YOUR_LONG_LIVED_TOKEN
Body: {"scene": "goodnight", "rooms": ["bedroom", "living_room"]}
Auth: Bearer Token
```

### Discord Webhook
```
Label: Alert Team
Method: POST
URL: https://discord.com/api/webhooks/.../...
Headers: Content-Type: application/json
Body: {"content": "Action triggered from DeskThing!", "username": "ActionThing"}
Auth: None
```

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- DeskThing development environment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Project Structure
```
ActionThing/
├── src/
│   ├── components/          # React components
│   │   ├── ActionButton.tsx # Individual button component
│   │   └── SettingsPanel.tsx # Configuration interface
│   ├── types/
│   │   └── action.ts        # TypeScript definitions
│   ├── App.tsx             # Main application
│   ├── main.tsx            # Entry point
│   └── index.css           # Styles
├── server/
│   └── index.ts            # DeskThing server module
├── deskthing/
│   ├── manifest.json       # App metadata
│   └── icons/
│       └── actionthing.svg # App icon
└── package.json
```

## Troubleshooting

### Common Issues

**Buttons not triggering:**
- Check URL is accessible
- Verify authentication credentials
- Review request headers and payload format
- Check logs for error details

**Authentication failures:**
- Ensure Bearer token is valid and not expired
- Verify Basic auth username/password
- Check if endpoint requires specific headers

**CORS errors:**
- Server-side requests bypass CORS restrictions
- Ensure target endpoint accepts requests from your network

**Configuration not saving:**
- Ensure valid JSON in request body
- Check all required fields are filled
- Restart DeskThing if issues persist

### Debug Tips

1. **Use the logs** - Check bottom-left corner for detailed error messages
2. **Test endpoints** - Use tools like Postman to verify your configurations
3. **Start simple** - Begin with GET requests to public APIs
4. **Check network** - Ensure DeskThing device can reach target URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. See LICENSE file for details.

## Support

- **Issues**: Report bugs and feature requests via GitHub issues
- **Documentation**: Additional guides available in the wiki
- **Community**: Join the DeskThing Discord for support and discussion

---

**Made for DeskThing** - Enhance your smart display with powerful webhook automation!
