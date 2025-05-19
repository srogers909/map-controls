/**
 * Script to check for outdated dependencies
 * 
 * Usage:
 * node scripts/check-deps.js
 */

const { execSync } = require('child_process');
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

// Function to check for outdated dependencies
function checkOutdatedDeps() {
  console.log(colorize('Checking for outdated dependencies...', 'cyan'));
  
  try {
    // Run npm outdated in JSON format
    const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8' });
    
    // If there are no outdated dependencies, npm outdated returns an empty string
    if (!outdatedOutput.trim()) {
      console.log(colorize('✅ All dependencies are up to date!', 'green'));
      return;
    }
    
    // Parse the JSON output
    const outdated = JSON.parse(outdatedOutput);
    const outdatedCount = Object.keys(outdated).length;
    
    console.log(colorize(`\nFound ${outdatedCount} outdated dependencies:`, 'yellow'));
    console.log(colorize('----------------------------------', 'yellow'));
    
    // Format the output
    Object.entries(outdated).forEach(([pkg, info]) => {
      const current = info.current || 'Not installed';
      const latest = info.latest;
      const type = info.type || 'unknown';
      
      console.log(colorize(`Package: ${pkg}`, 'bold'));
      console.log(`Current: ${colorize(current, 'red')}`);
      console.log(`Latest:  ${colorize(latest, 'green')}`);
      console.log(`Type:    ${type}`);
      console.log('----------------------------------');
    });
    
    console.log(colorize('\nTo update all dependencies to their latest versions:', 'cyan'));
    console.log(colorize('npm update', 'bold'));
    
    console.log(colorize('\nTo update a specific package:', 'cyan'));
    console.log(colorize('npm update <package-name>', 'bold'));
    
    console.log(colorize('\nTo update to the latest major version (may include breaking changes):', 'cyan'));
    console.log(colorize('npm install <package-name>@latest', 'bold'));
    
  } catch (error) {
    // If the command fails but doesn't throw an error (e.g., no outdated deps)
    if (error.status === 0) {
      console.log(colorize('✅ All dependencies are up to date!', 'green'));
    } else {
      console.error(colorize(`Error checking dependencies: ${error.message}`, 'red'));
    }
  }
}

// Function to check for security vulnerabilities
function checkVulnerabilities() {
  console.log(colorize('\nChecking for security vulnerabilities...', 'cyan'));
  
  try {
    // Run npm audit
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditOutput);
    
    if (audit.metadata.vulnerabilities.total === 0) {
      console.log(colorize('✅ No vulnerabilities found!', 'green'));
      return;
    }
    
    const { info, low, moderate, high, critical } = audit.metadata.vulnerabilities;
    
    console.log(colorize(`\nFound vulnerabilities:`, 'yellow'));
    console.log(colorize('----------------------------------', 'yellow'));
    console.log(`Critical: ${colorize(critical, critical > 0 ? 'red' : 'green')}`);
    console.log(`High:     ${colorize(high, high > 0 ? 'red' : 'green')}`);
    console.log(`Moderate: ${colorize(moderate, moderate > 0 ? 'yellow' : 'green')}`);
    console.log(`Low:      ${colorize(low, low > 0 ? 'yellow' : 'green')}`);
    console.log(`Info:     ${colorize(info, 'green')}`);
    console.log('----------------------------------');
    
    console.log(colorize('\nTo fix vulnerabilities:', 'cyan'));
    console.log(colorize('npm audit fix', 'bold'));
    
    console.log(colorize('\nTo fix vulnerabilities that require major version updates:', 'cyan'));
    console.log(colorize('npm audit fix --force', 'bold'));
    console.log(colorize('(Note: This may include breaking changes)', 'yellow'));
    
  } catch (error) {
    // Parse the error output as it might contain JSON with vulnerability info
    try {
      const errorOutput = error.stdout.toString();
      const audit = JSON.parse(errorOutput);
      
      const { info, low, moderate, high, critical } = audit.metadata.vulnerabilities;
      const total = info + low + moderate + high + critical;
      
      if (total === 0) {
        console.log(colorize('✅ No vulnerabilities found!', 'green'));
        return;
      }
      
      console.log(colorize(`\nFound vulnerabilities:`, 'yellow'));
      console.log(colorize('----------------------------------', 'yellow'));
      console.log(`Critical: ${colorize(critical, critical > 0 ? 'red' : 'green')}`);
      console.log(`High:     ${colorize(high, high > 0 ? 'red' : 'green')}`);
      console.log(`Moderate: ${colorize(moderate, moderate > 0 ? 'yellow' : 'green')}`);
      console.log(`Low:      ${colorize(low, low > 0 ? 'yellow' : 'green')}`);
      console.log(`Info:     ${colorize(info, 'green')}`);
      console.log('----------------------------------');
      
      console.log(colorize('\nTo fix vulnerabilities:', 'cyan'));
      console.log(colorize('npm audit fix', 'bold'));
      
      console.log(colorize('\nTo fix vulnerabilities that require major version updates:', 'cyan'));
      console.log(colorize('npm audit fix --force', 'bold'));
      console.log(colorize('(Note: This may include breaking changes)', 'yellow'));
      
    } catch (parseError) {
      console.error(colorize(`Error checking vulnerabilities: ${error.message}`, 'red'));
    }
  }
}

// Main function
function main() {
  console.log(colorize('=== Map Controls Dependency Checker ===', 'bold'));
  
  // Get package.json
  const packageJson = getPackageJson();
  
  // Display basic package info
  console.log(colorize(`\nPackage: ${packageJson.name} v${packageJson.version}`, 'blue'));
  console.log(colorize(`Description: ${packageJson.description}`, 'blue'));
  
  // Count dependencies
  const depCount = Object.keys(packageJson.dependencies || {}).length;
  const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
  
  console.log(colorize(`\nDependencies: ${depCount}`, 'blue'));
  console.log(colorize(`Dev Dependencies: ${devDepCount}`, 'blue'));
  
  // Check for outdated dependencies
  checkOutdatedDeps();
  
  // Check for security vulnerabilities
  checkVulnerabilities();
}

// Run the script
main();
