/**
 * Simple script to convert Markdown files to HTML
 * 
 * Usage:
 * node md-to-html.js
 */

const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Configure marked
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false
});

// HTML template
const htmlTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Map Controls Documentation</title>
  <link rel="stylesheet" href="/documentation/assets/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.0.0/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize syntax highlighting
      hljs.highlightAll();
      
      // Initialize mermaid diagrams
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'neutral',
        flowchart: { 
          useMaxWidth: true, 
          htmlLabels: true 
        }
      });
    });
  </script>
</head>
<body>
  <div class="container">
    <header>
      <h1>${title}</h1>
    </header>
    
    <nav class="main-nav">
      <ul>
        <li><a href="/documentation/index.html">Home</a></li>
        <li><a href="/documentation/guides/getting-started.html">Getting Started</a></li>
        <li><a href="/documentation/guides/installation.html">Installation</a></li>
        <li><a href="/documentation/api/index.html">API Reference</a></li>
        <li><a href="/documentation/examples/index.html">Examples</a></li>
        <li><a href="/documentation/guides/advanced-usage.html">Advanced Usage</a></li>
      </ul>
    </nav>
    
    <main>
      ${content}
    </main>
    
    <footer class="footer">
      <p>Map Controls is licensed under the MIT License.</p>
      <p>Documentation generated on ${new Date().toLocaleDateString()}</p>
    </footer>
  </div>
</body>
</html>
`;

// Function to convert a markdown file to HTML
function convertFile(mdFilePath) {
  try {
    // Read the markdown file
    const markdown = fs.readFileSync(mdFilePath, 'utf8');
    
    // Extract the title from the first heading
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(mdFilePath, '.md');
    
    // Convert markdown to HTML
    const htmlContent = marked.parse(markdown);
    
    // Create the full HTML
    const html = htmlTemplate(title, htmlContent);
    
    // Determine the output path
    const htmlFilePath = mdFilePath.replace(/\.md$/, '.html');
    
    // Write the HTML file
    fs.writeFileSync(htmlFilePath, html);
    
    console.log(`Converted ${mdFilePath} to ${htmlFilePath}`);
  } catch (error) {
    console.error(`Error converting ${mdFilePath}:`, error);
  }
}

// Function to process a directory recursively
function processDirectory(dirPath) {
  // Read the directory
  const items = fs.readdirSync(dirPath);
  
  // Process each item
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(itemPath);
    } else if (stats.isFile() && item.endsWith('.md')) {
      // Convert markdown files
      convertFile(itemPath);
    }
  }
}

// Main function
function main() {
  // Get the documentation root directory
  const docRoot = path.resolve(__dirname, '..');
  
  console.log('Converting Markdown files to HTML...');
  
  // Process the documentation directory
  processDirectory(docRoot);
  
  console.log('Conversion complete!');
}

// Run the script
main();
