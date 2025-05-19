/**
 * Script to prepare for a release by running all necessary steps in sequence
 * 
 * Usage:
 * node scripts/prepare-release.js
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
  console.log(colorize('=== Map Controls Release Preparation ===', 'bold'));
  console.log('This script will run all necessary steps to prepare for a release:');
  console.log('1. Format code');
  console.log('2. Lint code');
  console.log('3. Run tests with coverage');
  console.log('4. Build the project');
  console.log('5. Build documentation');
  console.log('6. Check for broken links');
  console.log('7. Initialize or update changelog');
  console.log('8. Create a release bundle');
  
  const confirmed = await confirm('\nDo you want to continue?');
  if (!confirmed) {
    console.log(colorize('Release preparation cancelled.', 'yellow'));
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
    
    // Step 7: Initialize or update changelog
    const changelogConfirmed = await confirm('\nDo you want to initialize or update the changelog?');
    if (changelogConfirmed) {
      // Check if CHANGELOG.md exists
      const fs = require('fs');
      const path = require('path');
      const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
      
      if (!fs.existsSync(changelogPath)) {
        await runCommand('npm run init-changelog', 'Initialize changelog');
      } else {
        // Ask for the tag range
        const rl = createInterface();
        const fromTag = await new Promise(resolve => {
          rl.question('Enter the starting tag for changelog (e.g., v0.1.0): ', answer => {
            rl.close();
            resolve(answer.trim());
          });
        });
        
        if (fromTag) {
          await runCommand(`npm run changelog ${fromTag} HEAD`, 'Update changelog');
        } else {
          console.log(colorize('Skipping changelog update due to missing tag.', 'yellow'));
        }
      }
    }
    
    // Step 8: Create a release bundle
    const releaseConfirmed = await confirm('\nDo you want to create a release bundle?');
    if (releaseConfirmed) {
      await runCommand('npm run release', 'Create release bundle');
    }
    
    console.log(colorize('\n✅ Release preparation completed successfully!', 'green'));
    
  } catch (error) {
    console.error(colorize('\n❌ Release preparation failed!', 'red'));
    
    // Ask if the user wants to continue despite the error
    const continueAnyway = await confirm('Do you want to continue with the remaining steps?');
    if (!continueAnyway) {
      console.log(colorize('Release preparation stopped.', 'yellow'));
      process.exit(1);
    }
    
    // Continue with the remaining steps
    console.log(colorize('Continuing with the remaining steps...', 'yellow'));
    
    // This is a simplified approach; in a real scenario, you would determine which steps to run
    try {
      // Ask if the user wants to create a release bundle
      const releaseConfirmed = await confirm('\nDo you want to create a release bundle?');
      if (releaseConfirmed) {
        await runCommand('npm run release', 'Create release bundle');
      }
      
      console.log(colorize('\n✅ Release preparation completed with some errors.', 'yellow'));
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
