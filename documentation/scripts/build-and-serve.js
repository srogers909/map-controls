/**
 * Combined script to build documentation, generate sitemap, and serve
 * 
 * Usage:
 * node build-and-serve.js
 */

const { execSync } = require('child_process');
const path = require('path');

// Main function
async function main() {
  try {
    console.log('=== Map Controls Documentation Builder ===');
    
    // Step 1: Build the documentation (convert MD to HTML)
    console.log('\n📝 Building documentation...');
    execSync('node ' + path.join(__dirname, 'md-to-html.js'), { stdio: 'inherit' });
    
    // Step 2: Generate sitemap
    console.log('\n🗺️ Generating sitemap...');
    execSync('node ' + path.join(__dirname, 'generate-sitemap.js'), { stdio: 'inherit' });
    
    // Step 3: Check for broken links
    console.log('\n🔍 Checking for broken links...');
    execSync('node ' + path.join(__dirname, 'check-links.js'), { stdio: 'inherit' });
    
    // Step 4: Serve the documentation
    console.log('\n🌐 Starting documentation server...');
    console.log('Documentation will be available at http://localhost:8080/documentation/');
    console.log('Press Ctrl+C to stop the server');
    
    // Use http-server to serve the documentation
    execSync('npx http-server -o /documentation', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
