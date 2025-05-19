# Map Controls Documentation

This folder contains comprehensive documentation for the Map Controls module.

## Documentation Structure

The documentation is organized into the following sections:

- **Home**: The main landing page with an overview of the module
- **Guides**: Step-by-step instructions for common tasks
- **API Reference**: Detailed documentation of all classes, methods, and interfaces
- **Examples**: Code examples demonstrating various use cases
- **Assets**: Styles and images used in the documentation

## Viewing the Documentation

### Option 1: All-in-One Command

The easiest way to build and view the documentation is to use the all-in-one command:

```bash
# From the project root
npm run docs
```

This will:
1. Build the documentation (convert Markdown to HTML)
2. Generate a sitemap
3. Start a local server and open the documentation in your browser

### Option 2: Individual Commands

You can also use the individual commands:

```bash
# Build the documentation (convert Markdown to HTML)
npm run build-docs

# Generate sitemap
npm run generate-sitemap

# Check for broken links in the documentation
npm run check-links

# Serve the documentation
npm run serve-docs
```

### Option 3: View Locally

To view the documentation locally without a server, simply open the `index.html` file in your web browser:

```bash
# Open with your default browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

Note: Some features like diagrams may not render correctly without a server.

## Documentation Features

The documentation includes:

1. **Interactive Diagrams**: Mermaid diagrams that visualize the architecture and flows
2. **Syntax Highlighting**: Code examples with proper syntax highlighting
3. **Cross-References**: Links between related sections for easy navigation
4. **Responsive Design**: Documentation is readable on all devices

## Customizing the Documentation

### Styles

The documentation uses a custom CSS file located at `assets/styles.css`. You can modify this file to change the appearance of the documentation.

### Adding New Pages

To add a new page:

1. Create a new Markdown (`.md`) or HTML (`.html`) file in the appropriate directory
2. Add links to the new page from existing pages
3. Update the navigation if necessary

## Building the Documentation

The documentation is written in a combination of Markdown and HTML. Markdown files are rendered as HTML when viewed in a browser with the appropriate extensions.

If you make changes to the documentation, you may need to rebuild it:

```bash
# If using a documentation generator (not included by default)
npm run build-docs
```

## Contributing to the Documentation

If you find errors or want to improve the documentation:

1. Make your changes to the relevant files
2. Test the documentation locally to ensure it renders correctly
3. Submit a pull request with your changes

## License

The documentation is licensed under the same license as the Map Controls module (MIT).
