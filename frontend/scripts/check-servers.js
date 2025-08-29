#!/usr/bin/env node

const https = require('https');
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
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    };

    const requestModule = urlObj.protocol === 'https:' ? https : http;

    const req = requestModule.request(options, (res) => {
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
  colorLog('\n🔍 Checking Loop App Deployed Servers...', colors.blue + colors.bold);
  console.log('');

  const checks = await Promise.all([
    checkServer('https://loop-dev.netlify.app/', 'Frontend (Netlify)'),
    checkServer('https://loop-backend-rl4o.onrender.com/api', 'Backend (Render)')
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
    colorLog('🎉 All deployed servers are running! You can now run Cypress tests.', colors.green + colors.bold);
    console.log('');
    colorLog('Run tests with:', colors.blue);
    colorLog('  npm run test:e2e:dev    # Interactive mode', colors.reset);
    colorLog('  npm run test:e2e        # Headless mode', colors.reset);
  } else {
    colorLog('⚠️  Some deployed servers are not responding.', colors.yellow + colors.bold);
    console.log('');
    colorLog('This might be due to:', colors.blue);
    colorLog('  • Temporary server downtime on Render/Netlify', colors.reset);
    colorLog('  • Network connectivity issues', colors.reset);
    colorLog('  • Server cold start (Render free tier)', colors.reset);
    console.log('');
    colorLog('Please wait a moment and try again, or check:', colors.blue);
    colorLog('  • Frontend: https://loop-dev.netlify.app/', colors.reset);
    colorLog('  • Backend: https://loop-backend-rl4o.onrender.com/api', colors.reset);
  }

  console.log('');
  process.exit(allRunning ? 0 : 1);
}

main().catch(console.error);