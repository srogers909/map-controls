/**
 * Simple script to generate a sitemap for the documentation
 * 
 * Usage:
 * node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Base URL for the documentation
const BASE_URL = 'https://example.com/documentation';

// Function to recursively scan directories for HTML and MD files
function scanDirectory(dir, baseDir) {
  const results = [];
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
      results.push(...scanDirectory(itemPath, baseDir));
    } else if (stats.isFile()) {
      // Only include HTML and MD files
      if (item.endsWith('.html') || item.endsWith('.md')) {
        // Get the relative path from the base directory
        const relativePath = path.relative(baseDir, itemPath);
        
        // Convert backslashes to forward slashes for URLs
        const urlPath = relativePath.replace(/\\/g, '/');
        
        // Add to results
        results.push({
          path: urlPath,
          lastModified: stats.mtime.toISOString().split('T')[0],
          priority: getPriority(urlPath)
        });
      }
    }
  }
  
  return results;
}

// Function to determine the priority of a page
function getPriority(urlPath) {
  if (urlPath === 'index.html') {
    return 1.0;
  } else if (urlPath.startsWith('guides/')) {
    return 0.8;
  } else if (urlPath.startsWith('api/')) {
    return 0.7;
  } else if (urlPath.startsWith('examples/')) {
    return 0.6;
  } else {
    return 0.5;
  }
}

// Function to generate XML sitemap
function generateSitemap(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/${url.path}</loc>\n`;
    xml += `    <lastmod>${url.lastModified}</lastmod>\n`;
    xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>';
  
  return xml;
}

// Function to generate HTML sitemap
function generateHtmlSitemap(urls) {
  // Group URLs by directory
  const groups = {};
  
  for (const url of urls) {
    const parts = url.path.split('/');
    const group = parts.length > 1 ? parts[0] : 'root';
    
    if (!groups[group]) {
      groups[group] = [];
    }
    
    groups[group].push(url);
  }
  
  // Generate HTML
  let html = '<!DOCTYPE html>\n';
  html += '<html lang="en">\n';
  html += '<head>\n';
  html += '  <meta charset="UTF-8">\n';
  html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  html += '  <title>Map Controls Documentation Sitemap</title>\n';
  html += '  <link rel="stylesheet" href="/documentation/assets/styles.css">\n';
  html += '</head>\n';
  html += '<body>\n';
  html += '  <div class="container">\n';
  html += '    <h1>Documentation Sitemap</h1>\n';
  
  // Add each group
  for (const [group, groupUrls] of Object.entries(groups)) {
    const groupName = group === 'root' ? 'Main Pages' : group.charAt(0).toUpperCase() + group.slice(1);
    
    html += `    <h2>${groupName}</h2>\n`;
    html += '    <ul>\n';
    
    for (const url of groupUrls) {
      // Get the page name from the URL
      const pageName = url.path.split('/').pop().replace(/\.(html|md)$/, '');
      const displayName = pageName === 'index' ? 'Home' : pageName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      html += `      <li><a href="/${url.path}">${displayName}</a></li>\n`;
    }
    
    html += '    </ul>\n';
  }
  
  html += '    <footer class="footer">\n';
  html += '      <p>Map Controls is licensed under the MIT License.</p>\n';
  html += `      <p>Sitemap generated on ${new Date().toLocaleDateString()}</p>\n`;
  html += '    </footer>\n';
  html += '  </div>\n';
  html += '</body>\n';
  html += '</html>';
  
  return html;
}

// Main function
function main() {
  // Get the documentation root directory
  const docRoot = path.resolve(__dirname, '..');
  
  console.log('Scanning documentation directory...');
  
  // Scan the documentation directory
  const urls = scanDirectory(docRoot, docRoot);
  
  console.log(`Found ${urls.length} pages.`);
  
  // Generate XML sitemap
  const xmlSitemap = generateSitemap(urls);
  fs.writeFileSync(path.join(docRoot, 'sitemap.xml'), xmlSitemap);
  console.log('Generated sitemap.xml');
  
  // Generate HTML sitemap
  const htmlSitemap = generateHtmlSitemap(urls);
  fs.writeFileSync(path.join(docRoot, 'sitemap.html'), htmlSitemap);
  console.log('Generated sitemap.html');
  
  console.log('Sitemap generation complete!');
}

// Run the script
main();
