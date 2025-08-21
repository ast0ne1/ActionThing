const fs = require('fs');
const path = require('path');

// Create necessary directories
const dirs = [
  'src',
  'src/components',
  'src/types',
  'server',
  'deskthing/icons'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create a simple icon SVG if it doesn't exist
const iconPath = path.join('deskthing', 'icons', 'actionthing.svg');
if (!fs.existsSync(iconPath)) {
  const iconContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <line x1="9" y1="9" x2="15" y2="9"/>
  <line x1="9" y1="12" x2="15" y2="12"/>
  <line x1="9" y1="15" x2="15" y2="15"/>
  <circle cx="6" cy="6" r="1"/>
  <circle cx="6" cy="12" r="1"/>
  <circle cx="6" cy="18" r="1"/>
</svg>`;
  
  fs.writeFileSync(iconPath, iconContent);
  console.log('Created icon: actionthing.svg');
}

console.log('ActionThing setup complete!');
console.log('Run "npm install" to install dependencies');
console.log('Run "npm run dev" to start development');
