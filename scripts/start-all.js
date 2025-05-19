/**
 * Script to start both the example and documentation servers
 * 
 * Usage:
 * node scripts/start-all.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create the scripts directory if it doesn't exist
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Function to start a process
function startProcess(command, args, name, color) {
  const colorCodes = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colorCodes[color]}Starting ${name}...${colorCodes.reset}`);
  
  const process = spawn(command, args, {
    stdio: 'pipe',
    shell: true
  });
  
  process.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${colorCodes[color]}[${name}] ${line}${colorCodes.reset}`);
    });
  });
  
  process.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.error(`${colorCodes.red}[${name} ERROR] ${line}${colorCodes.reset}`);
    });
  });
  
  process.on('close', (code) => {
    if (code !== 0) {
      console.log(`${colorCodes.red}[${name}] Process exited with code ${code}${colorCodes.reset}`);
    } else {
      console.log(`${colorCodes[color]}[${name}] Process completed successfully${colorCodes.reset}`);
    }
  });
  
  return process;
}

// Main function
async function main() {
  console.log('=== Map Controls Development Environment ===');
  console.log('Starting all services...');
  
  // Start the example server
  const exampleProcess = startProcess('node', ['example/run-example.js'], 'Example Server', 'green');
  
  // Wait a bit before starting the documentation server to avoid port conflicts
  setTimeout(() => {
    // Build and serve the documentation
    const docsProcess = startProcess('node', ['documentation/scripts/build-and-serve.js'], 'Documentation Server', 'blue');
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\nShutting down all services...');
      exampleProcess.kill();
      docsProcess.kill();
      process.exit(0);
    });
  }, 2000);
  
  console.log('\nPress Ctrl+C to stop all services');
}

// Run the script
main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
