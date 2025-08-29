#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function colorLog(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkServer(url, name) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      resolve({ name, url, running: true, status: res.statusCode });
    });

    req.on('error', () => {
      resolve({ name, url, running: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ name, url, running: false });
    });

    req.end();
  });
}

async function main() {
  colorLog('\n🔍 Checking Loop App Servers...', colors.blue + colors.bold);
  console.log('');

  const checks = await Promise.all([
    checkServer('http://localhost:3000', 'Frontend (React)'),
    checkServer('http://localhost:5000/api', 'Backend (API)')
  ]);

  let allRunning = true;

  for (const check of checks) {
    const status = check.running 
      ? `${colors.green}✅ Running${colors.reset}`
      : `${colors.red}❌ Not Running${colors.reset}`;
    
    console.log(`${check.name.padEnd(20)} ${check.url.padEnd(25)} ${status}`);
    
    if (!check.running) {
      allRunning = false;
    }
  }

  console.log('');

  if (allRunning) {
    colorLog('🎉 All servers are running! You can now run Cypress tests.', colors.green + colors.bold);
    console.log('');
    colorLog('Run tests with:', colors.blue);
    colorLog('  npm run test:e2e:dev    # Interactive mode', colors.reset);
    colorLog('  npm run test:e2e        # Headless mode', colors.reset);
  } else {
    colorLog('⚠️  Some servers are not running. Start them first:', colors.yellow + colors.bold);
    console.log('');
    
    if (!checks[1].running) {
      colorLog('Start Backend Server (Terminal 1):', colors.blue);
      colorLog('  cd backend && npm run dev', colors.reset);
      console.log('');
    }
    
    if (!checks[0].running) {
      colorLog('Start Frontend Server (Terminal 2):', colors.blue);
      colorLog('  cd frontend && npm start', colors.reset);
      console.log('');
    }
    
    colorLog('Then run this script again to verify:', colors.blue);
    colorLog('  npm run check:servers', colors.reset);
  }

  console.log('');
  process.exit(allRunning ? 0 : 1);
}

main().catch(console.error);