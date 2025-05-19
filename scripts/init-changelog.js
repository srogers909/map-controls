/**
 * Script to initialize an empty CHANGELOG.md file
 * 
 * Usage:
 * node scripts/init-changelog.js
 */

const fs = require('fs');
const path = require('path');

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

// Function to get package.json content
function getPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(colorize('Error: package.json not found!', 'red'));
    process.exit(1);
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson;
  } catch (error) {
    console.error(colorize(`Error parsing package.json: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// Function to create an empty changelog
function createEmptyChangelog() {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  
  // Check if changelog already exists
  if (fs.existsSync(changelogPath)) {
    console.log(colorize('CHANGELOG.md already exists!', 'yellow'));
    
    // Ask if the user wants to overwrite it
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Do you want to overwrite it? (y/n): ', answer => {
      readline.close();
      
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        writeChangelog(changelogPath);
      } else {
        console.log(colorize('Operation cancelled.', 'yellow'));
      }
    });
  } else {
    writeChangelog(changelogPath);
  }
}

// Function to write the changelog
function writeChangelog(changelogPath) {
  const packageJson = getPackageJson();
  const { name, version, description } = packageJson;
  
  const date = new Date().toISOString().split('T')[0];
  
  const content = `# Changelog

All notable changes to the ${name} project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${date}

Initial release

### Features

- Framework-agnostic implementation
- TypeScript support
- Pan and zoom functionality for custom maps
- Boundary constraints for panning and zooming
- Mouse and button controls
- Extendable architecture

[${version}]: https://github.com/username/map-controls/releases/tag/v${version}
`;
  
  try {
    fs.writeFileSync(changelogPath, content);
    console.log(colorize(`✅ CHANGELOG.md created at ${changelogPath}`, 'green'));
  } catch (error) {
    console.error(colorize(`Error creating CHANGELOG.md: ${error.message}`, 'red'));
  }
}

// Main function
function main() {
  console.log(colorize('=== Map Controls Changelog Initializer ===', 'bold'));
  createEmptyChangelog();
}

// Run the script
main();
