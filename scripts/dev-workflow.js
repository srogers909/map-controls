/**
 * Script to run the complete development workflow
 * 
 * Usage:
 * node scripts/dev-workflow.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Function to colorize text
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Function to create a readline interface for user input
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Function to prompt for confirmation
function confirm(question) {
  const rl = createInterface();
  
  return new Promise(resolve => {
    rl.question(question + ' (y/n): ', answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Function to run a command and return a promise
function runCommand(command, name) {
  console.log(colorize(`\n=== Running ${name} ===`, 'cyan'));
  
  return new Promise((resolve, reject) => {
    try {
      execSync(command, { stdio: 'inherit' });
      console.log(colorize(`✅ ${name} completed successfully!`, 'green'));
      resolve(true);
    } catch (error) {
      console.error(colorize(`❌ ${name} failed: ${error.message}`, 'red'));
      reject(error);
    }
  });
}

// Main function
async function main() {
  console.log(colorize('=== Map Controls Development Workflow ===', 'bold'));
  console.log('This script will run the complete development workflow:');
  console.log('1. Format code');
  console.log('2. Lint code');
  console.log('3. Run tests with coverage');
  console.log('4. Build the project');
  console.log('5. Build documentation');
  console.log('6. Check for broken links');
  console.log('7. Check dependencies');
  
  const confirmed = await confirm('\nDo you want to continue?');
  if (!confirmed) {
    console.log(colorize('Workflow cancelled.', 'yellow'));
    process.exit(0);
  }
  
  try {
    // Step 1: Format code
    await runCommand('npm run format', 'Code formatting');
    
    // Step 2: Lint code
    await runCommand('npm run lint', 'Code linting');
    
    // Step 3: Run tests with coverage
    await runCommand('npm run test:coverage', 'Tests with coverage');
    
    // Step 4: Build the project
    await runCommand('npm run build', 'Project build');
    
    // Step 5: Build documentation
    await runCommand('npm run build-docs', 'Documentation build');
    
    // Step 6: Check for broken links
    await runCommand('npm run check-links', 'Link checking');
    
    // Step 7: Check dependencies
    await runCommand('npm run check-deps', 'Dependency check');
    
    console.log(colorize('\n✅ Development workflow completed successfully!', 'green'));
    
    // Ask if the user wants to start the servers
    const startServers = await confirm('\nDo you want to start the example and documentation servers?');
    if (startServers) {
      console.log(colorize('\nStarting servers...', 'cyan'));
      console.log(colorize('Press Ctrl+C to stop the servers when done.', 'yellow'));
      
      // Start the servers
      execSync('npm run start-all', { stdio: 'inherit' });
    }
    
  } catch (error) {
    console.error(colorize('\n❌ Development workflow failed!', 'red'));
    
    // Ask if the user wants to continue despite the error
    const continueAnyway = await confirm('Do you want to continue with the remaining steps?');
    if (!continueAnyway) {
      console.log(colorize('Workflow stopped.', 'yellow'));
      process.exit(1);
    }
    
    // Continue with the remaining steps
    console.log(colorize('Continuing with the remaining steps...', 'yellow'));
    
    // Determine which step failed and continue from the next step
    // This is a simplified approach; in a real scenario, you might want to track which step failed more precisely
    try {
      // Try to continue with the remaining steps
      // This is just a placeholder; in a real scenario, you would determine which steps to run
      console.log(colorize('\nContinuing with the remaining steps...', 'yellow'));
      
      // Ask if the user wants to start the servers
      const startServers = await confirm('\nDo you want to start the example and documentation servers?');
      if (startServers) {
        console.log(colorize('\nStarting servers...', 'cyan'));
        console.log(colorize('Press Ctrl+C to stop the servers when done.', 'yellow'));
        
        // Start the servers
        execSync('npm run start-all', { stdio: 'inherit' });
      }
    } catch (continueError) {
      console.error(colorize(`\n❌ Failed to continue: ${continueError.message}`, 'red'));
      process.exit(1);
    }
  }
}

// Run the script
main().catch(err => {
  console.error(colorize(`Error: ${err.message}`, 'red'));
  process.exit(1);
});
