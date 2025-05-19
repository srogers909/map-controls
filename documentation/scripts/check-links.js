/**
 * Script to check for broken links in the documentation
 * 
 * Usage:
 * node check-links.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Base directory for documentation
const baseDir = path.resolve(__dirname, '..');

// Track results
const results = {
  checkedFiles: 0,
  brokenLinks: [],
  missingFiles: []
};

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Function to check links in HTML files
function checkHtmlLinks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    const links = document.querySelectorAll('a');
    
    results.checkedFiles++;
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip empty links, anchors, and external links
      if (!href || href === '#' || href.startsWith('http://') || href.startsWith('https://')) {
        return;
      }
      
      // Handle relative links
      let targetPath;
      if (href.startsWith('/')) {
        // Absolute path from the documentation root
        targetPath = path.join(baseDir, href.substring(1));
      } else {
        // Relative path from the current file
        targetPath = path.join(path.dirname(filePath), href);
      }
      
      // Check if the target file exists
      if (!fileExists(targetPath)) {
        // Check if it's a directory that might have an index.html
        if (fileExists(path.join(targetPath, 'index.html'))) {
          return;
        }
        
        // Check if it's an anchor link to the current page
        if (href.includes('#') && href.split('#')[0] === '') {
          return;
        }
        
        results.brokenLinks.push({
          file: path.relative(baseDir, filePath),
          link: href,
          target: path.relative(baseDir, targetPath)
        });
      }
    });
  } catch (err) {
    console.error(`Error checking links in ${filePath}:`, err);
  }
}

// Function to check links in Markdown files
function checkMarkdownLinks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Regular expression to find Markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    results.checkedFiles++;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const href = match[2];
      
      // Skip external links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        continue;
      }
      
      // Handle relative links
      let targetPath;
      if (href.startsWith('/')) {
        // Absolute path from the documentation root
        targetPath = path.join(baseDir, href.substring(1));
      } else {
        // Relative path from the current file
        targetPath = path.join(path.dirname(filePath), href);
      }
      
      // Remove anchor part if present
      const pathWithoutAnchor = targetPath.split('#')[0];
      
      // Check if the target file exists
      if (!fileExists(pathWithoutAnchor)) {
        results.brokenLinks.push({
          file: path.relative(baseDir, filePath),
          link: href,
          text: linkText,
          target: path.relative(baseDir, targetPath)
        });
      }
    }
  } catch (err) {
    console.error(`Error checking links in ${filePath}:`, err);
  }
}

// Function to recursively scan directories
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Skip node_modules and other special directories
      if (item === 'node_modules' || item === '.git' || item === 'dist') {
        continue;
      }
      
      // Recursively scan subdirectories
      scanDirectory(itemPath);
    } else if (stats.isFile()) {
      // Check file extension
      if (item.endsWith('.html')) {
        checkHtmlLinks(itemPath);
      } else if (item.endsWith('.md')) {
        checkMarkdownLinks(itemPath);
      }
    }
  }
}

// Function to print results
function printResults() {
  console.log(`\nChecked ${results.checkedFiles} files`);
  
  if (results.brokenLinks.length === 0) {
    console.log('\n✅ No broken links found!');
  } else {
    console.log(`\n❌ Found ${results.brokenLinks.length} broken links:`);
    
    results.brokenLinks.forEach((brokenLink, index) => {
      console.log(`\n${index + 1}. In file: ${brokenLink.file}`);
      console.log(`   Link: ${brokenLink.link}`);
      if (brokenLink.text) {
        console.log(`   Text: ${brokenLink.text}`);
      }
      console.log(`   Target: ${brokenLink.target}`);
    });
  }
  
  if (results.missingFiles.length > 0) {
    console.log(`\n⚠️ Found ${results.missingFiles.length} missing files:`);
    results.missingFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
  }
}

// Main function
function main() {
  console.log('Checking for broken links in documentation...');
  
  // Scan the documentation directory
  scanDirectory(baseDir);
  
  // Print results
  printResults();
}

// Run the script
main();
