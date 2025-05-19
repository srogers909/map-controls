/**
 * Script to create a release bundle of the project
 * 
 * Usage:
 * node scripts/create-release.js [version]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
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

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
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

// Function to update package.json version
function updatePackageVersion(version) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = getPackageJson();
  
  packageJson.version = version;
  
  try {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(colorize(`✅ Updated package.json version to ${version}`, 'green'));
  } catch (error) {
    console.error(colorize(`Error updating package.json: ${error.message}`, 'red'));
    process.exit(1);
  }
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

// Function to prompt for version
function promptForVersion(currentVersion) {
  const rl = createInterface();
  
  return new Promise(resolve => {
    rl.question(`Enter new version (current: ${currentVersion}): `, answer => {
      rl.close();
      resolve(answer.trim() || currentVersion);
    });
  });
}

// Function to ensure CHANGELOG.md exists
async function ensureChangelogExists() {
  console.log(colorize('\nChecking for CHANGELOG.md...', 'cyan'));
  
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    console.log(colorize('CHANGELOG.md not found!', 'yellow'));
    const createChangelog = await confirm('Do you want to create a CHANGELOG.md file?');
    
    if (createChangelog) {
      try {
        execSync('npm run init-changelog', { stdio: 'inherit' });
        console.log(colorize('✅ CHANGELOG.md created!', 'green'));
        return true;
      } catch (error) {
        console.error(colorize(`❌ Failed to create CHANGELOG.md: ${error.message}`, 'red'));
        return false;
      }
    } else {
      console.log(colorize('Continuing without CHANGELOG.md...', 'yellow'));
      return true;
    }
  }
  
  console.log(colorize('✅ CHANGELOG.md exists!', 'green'));
  return true;
}

// Function to run tests
async function runTests() {
  console.log(colorize('\nRunning tests...', 'cyan'));
  
  try {
    execSync('npm test', { stdio: 'inherit' });
    console.log(colorize('✅ Tests passed!', 'green'));
    return true;
  } catch (error) {
    console.error(colorize('❌ Tests failed!', 'red'));
    const continueAnyway = await confirm('Tests failed. Continue anyway?');
    return continueAnyway;
  }
}

// Function to build the project
function buildProject() {
  console.log(colorize('\nBuilding project...', 'cyan'));
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(colorize('✅ Build successful!', 'green'));
    return true;
  } catch (error) {
    console.error(colorize(`❌ Build failed: ${error.message}`, 'red'));
    return false;
  }
}

// Function to create a release bundle
function createReleaseBundle(version) {
  console.log(colorize('\nCreating release bundle...', 'cyan'));
  
  // Create releases directory if it doesn't exist
  const releasesDir = path.join(process.cwd(), 'releases');
  ensureDirectoryExists(releasesDir);
  
  // Create a directory for this release
  const releaseDir = path.join(releasesDir, `v${version}`);
  ensureDirectoryExists(releaseDir);
  
  try {
    // Copy dist folder
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      execSync(`cp -r ${distDir} ${releaseDir}/`);
    } else {
      console.error(colorize('⚠️ dist directory not found!', 'yellow'));
    }
    
    // Copy package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    fs.copyFileSync(packageJsonPath, path.join(releaseDir, 'package.json'));
    
    // Copy README.md
    const readmePath = path.join(process.cwd(), 'README.md');
    if (fs.existsSync(readmePath)) {
      fs.copyFileSync(readmePath, path.join(releaseDir, 'README.md'));
    }
    
    // Copy LICENSE
    const licensePath = path.join(process.cwd(), 'LICENSE');
    if (fs.existsSync(licensePath)) {
      fs.copyFileSync(licensePath, path.join(releaseDir, 'LICENSE'));
    }
    
    // Create a zip file
    const zipFileName = `map-controls-v${version}.zip`;
    const zipFilePath = path.join(releasesDir, zipFileName);
    
    console.log(colorize(`\nCreating zip file: ${zipFileName}`, 'cyan'));
    
    // Use platform-specific zip command
    if (process.platform === 'win32') {
      // On Windows, use PowerShell to create a zip file
      execSync(`powershell -Command "Compress-Archive -Path '${releaseDir}/*' -DestinationPath '${zipFilePath}' -Force"`, { stdio: 'inherit' });
    } else {
      // On Unix-like systems, use zip command
      execSync(`cd "${releaseDir}" && zip -r "${zipFilePath}" ./*`, { stdio: 'inherit' });
    }
    
    console.log(colorize(`\n✅ Release bundle created: ${zipFilePath}`, 'green'));
    return true;
  } catch (error) {
    console.error(colorize(`❌ Failed to create release bundle: ${error.message}`, 'red'));
    return false;
  }
}

// Function to create a git tag
async function createGitTag(version) {
  console.log(colorize('\nCreating git tag...', 'cyan'));
  
  try {
    // Check if git is available
    execSync('git --version', { stdio: 'ignore' });
    
    // Check if the working directory is clean
    const status = execSync('git status --porcelain').toString().trim();
    if (status) {
      console.log(colorize('⚠️ Working directory is not clean!', 'yellow'));
      const continueAnyway = await confirm('There are uncommitted changes. Continue anyway?');
      if (!continueAnyway) {
        return false;
      }
    }
    
    // Commit the version change
    execSync(`git add package.json`, { stdio: 'inherit' });
    execSync(`git commit -m "Bump version to ${version}"`, { stdio: 'inherit' });
    
    // Create a tag
    execSync(`git tag -a v${version} -m "Version ${version}"`, { stdio: 'inherit' });
    
    console.log(colorize(`✅ Git tag v${version} created!`, 'green'));
    
    // Ask if the user wants to push the tag
    const pushTag = await confirm('Push the tag to remote?');
    if (pushTag) {
      execSync('git push', { stdio: 'inherit' });
      execSync('git push --tags', { stdio: 'inherit' });
      console.log(colorize('✅ Tag pushed to remote!', 'green'));
    }
    
    return true;
  } catch (error) {
    console.error(colorize(`❌ Failed to create git tag: ${error.message}`, 'red'));
    return false;
  }
}

// Main function
async function main() {
  console.log(colorize('=== Map Controls Release Creator ===', 'bold'));
  
  // Get package.json
  const packageJson = getPackageJson();
  const currentVersion = packageJson.version;
  
  console.log(colorize(`\nCurrent version: ${currentVersion}`, 'blue'));
  
  // Get version from command line or prompt
  let version = process.argv[2];
  if (!version) {
    version = await promptForVersion(currentVersion);
  }
  
  // Confirm the version
  const confirmed = await confirm(`Create release for version ${version}?`);
  if (!confirmed) {
    console.log(colorize('Release creation cancelled.', 'yellow'));
    process.exit(0);
  }
  
  // Ensure CHANGELOG.md exists
  const changelogOk = await ensureChangelogExists();
  if (!changelogOk) {
    const continueAnyway = await confirm('Failed to create CHANGELOG.md. Continue anyway?');
    if (!continueAnyway) {
      console.log(colorize('Release creation cancelled.', 'yellow'));
      process.exit(1);
    }
  }
  
  // Run tests
  const testsOk = await runTests();
  if (!testsOk) {
    const continueAnyway = await confirm('Tests failed. Continue anyway?');
    if (!continueAnyway) {
      console.log(colorize('Release creation cancelled.', 'yellow'));
      process.exit(1);
    }
  }
  
  // Update package.json version
  updatePackageVersion(version);
  
  // Build the project
  const buildOk = buildProject();
  if (!buildOk) {
    console.log(colorize('Release creation cancelled due to build failure.', 'red'));
    process.exit(1);
  }
  
  // Create release bundle
  const bundleOk = createReleaseBundle(version);
  if (!bundleOk) {
    console.log(colorize('Release creation cancelled due to bundle creation failure.', 'red'));
    process.exit(1);
  }
  
  // Create git tag
  const tagOk = await createGitTag(version);
  if (!tagOk) {
    console.log(colorize('Git tag creation failed, but release bundle was created.', 'yellow'));
  }
  
  console.log(colorize('\n✅ Release creation completed!', 'green'));
}

// Run the script
main().catch(err => {
  console.error(colorize(`Error: ${err.message}`, 'red'));
  process.exit(1);
});
