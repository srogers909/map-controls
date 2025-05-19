/**
 * Script to generate a changelog from git commits
 * 
 * Usage:
 * node scripts/generate-changelog.js [from-tag] [to-tag]
 * 
 * Example:
 * node scripts/generate-changelog.js v0.1.0 v0.2.0
 * node scripts/generate-changelog.js v0.1.0 HEAD
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

// Function to get git tags
function getGitTags() {
  try {
    const tags = execSync('git tag --sort=-v:refname').toString().trim().split('\n');
    return tags.filter(tag => tag); // Filter out empty strings
  } catch (error) {
    console.error(colorize(`Error getting git tags: ${error.message}`, 'red'));
    return [];
  }
}

// Function to get commits between tags
function getCommitsBetweenTags(fromTag, toTag) {
  try {
    const range = `${fromTag}..${toTag}`;
    const format = '%h|%s|%an|%ad';
    const command = `git log ${range} --pretty=format:"${format}" --date=short`;
    
    const output = execSync(command).toString().trim();
    if (!output) {
      return [];
    }
    
    return output.split('\n').map(line => {
      const [hash, subject, author, date] = line.split('|');
      return { hash, subject, author, date };
    });
  } catch (error) {
    console.error(colorize(`Error getting commits: ${error.message}`, 'red'));
    return [];
  }
}

// Function to categorize commits
function categorizeCommits(commits) {
  const categories = {
    features: [],
    fixes: [],
    docs: [],
    tests: [],
    refactor: [],
    chore: [],
    other: []
  };
  
  const patterns = {
    features: /^(feat|feature|add|new)(\(.*\))?:/i,
    fixes: /^(fix|bug|bugfix)(\(.*\))?:/i,
    docs: /^(docs|doc|documentation)(\(.*\))?:/i,
    tests: /^(test|tests)(\(.*\))?:/i,
    refactor: /^(refactor|refactoring|perf|performance)(\(.*\))?:/i,
    chore: /^(chore|build|ci|style|release)(\(.*\))?:/i
  };
  
  commits.forEach(commit => {
    const { subject } = commit;
    let categorized = false;
    
    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(subject)) {
        categories[category].push(commit);
        categorized = true;
        break;
      }
    }
    
    if (!categorized) {
      categories.other.push(commit);
    }
  });
  
  return categories;
}

// Function to generate markdown changelog
function generateMarkdownChangelog(fromTag, toTag, categories, packageJson) {
  const date = new Date().toISOString().split('T')[0];
  let markdown = '';
  
  // Add header
  markdown += `# Changelog\n\n`;
  
  // Add version header
  const version = toTag === 'HEAD' ? `${packageJson.version} (Unreleased)` : toTag.replace(/^v/, '');
  markdown += `## [${version}] - ${date}\n\n`;
  
  // Add comparison link
  markdown += `[${version}]: https://github.com/username/map-controls/compare/${fromTag}...${toTag === 'HEAD' ? 'main' : toTag}\n\n`;
  
  // Add categories
  const categoryTitles = {
    features: '### Features',
    fixes: '### Bug Fixes',
    docs: '### Documentation',
    tests: '### Tests',
    refactor: '### Refactoring',
    chore: '### Chores',
    other: '### Other Changes'
  };
  
  for (const [category, commits] of Object.entries(categories)) {
    if (commits.length === 0) {
      continue;
    }
    
    markdown += `${categoryTitles[category]}\n\n`;
    
    commits.forEach(commit => {
      const { hash, subject, author } = commit;
      const message = subject.replace(/^(feat|fix|docs|test|refactor|chore|style|perf|ci|build)(\(.*\))?:\s*/i, '');
      markdown += `- ${message} ([${hash}](https://github.com/username/map-controls/commit/${hash}))\n`;
    });
    
    markdown += '\n';
  }
  
  return markdown;
}

// Function to append to CHANGELOG.md
function appendToChangelog(content) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  
  try {
    let existingContent = '';
    if (fs.existsSync(changelogPath)) {
      existingContent = fs.readFileSync(changelogPath, 'utf8');
      
      // If the file already has a header, remove it from the new content
      if (existingContent.startsWith('# Changelog')) {
        content = content.replace('# Changelog\n\n', '');
      }
      
      // Find the position after the header to insert the new content
      const headerEndPos = existingContent.indexOf('\n\n');
      if (headerEndPos !== -1 && existingContent.startsWith('# Changelog')) {
        const header = existingContent.substring(0, headerEndPos + 2);
        const body = existingContent.substring(headerEndPos + 2);
        existingContent = header + content + body;
      } else {
        existingContent = content + existingContent;
      }
      
      fs.writeFileSync(changelogPath, existingContent);
    } else {
      fs.writeFileSync(changelogPath, content);
    }
    
    console.log(colorize(`✅ Changelog updated at ${changelogPath}`, 'green'));
    return true;
  } catch (error) {
    console.error(colorize(`Error updating changelog: ${error.message}`, 'red'));
    return false;
  }
}

// Main function
function main() {
  console.log(colorize('=== Map Controls Changelog Generator ===', 'bold'));
  
  // Get package.json
  const packageJson = getPackageJson();
  
  // Get git tags
  const tags = getGitTags();
  console.log(colorize(`Found ${tags.length} git tags`, 'blue'));
  
  // Get from and to tags from command line arguments or use defaults
  let fromTag = process.argv[2];
  let toTag = process.argv[3] || 'HEAD';
  
  if (!fromTag) {
    if (tags.length > 0) {
      fromTag = tags[0];
      console.log(colorize(`Using latest tag ${fromTag} as starting point`, 'yellow'));
    } else {
      console.error(colorize('No git tags found and no starting point specified!', 'red'));
      process.exit(1);
    }
  }
  
  console.log(colorize(`Generating changelog from ${fromTag} to ${toTag}`, 'blue'));
  
  // Get commits between tags
  const commits = getCommitsBetweenTags(fromTag, toTag);
  console.log(colorize(`Found ${commits.length} commits`, 'blue'));
  
  if (commits.length === 0) {
    console.log(colorize('No commits found between the specified tags!', 'yellow'));
    process.exit(0);
  }
  
  // Categorize commits
  const categories = categorizeCommits(commits);
  
  // Generate markdown changelog
  const markdown = generateMarkdownChangelog(fromTag, toTag, categories, packageJson);
  
  // Write to CHANGELOG.md
  appendToChangelog(markdown);
  
  // Print the changelog to the console
  console.log('\n' + markdown);
}

// Run the script
main();
