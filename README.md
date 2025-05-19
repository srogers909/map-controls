# Map Controls

A framework-agnostic TypeScript module for map panning and zooming.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- Framework-agnostic implementation
- TypeScript support
- Pan and zoom functionality for custom maps
- Boundary constraints for panning and zooming
- Mouse and button controls
- Extendable architecture

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```typescript
import { MapControls } from 'map-controls';

// Create a new instance
const mapControls = new MapControls({
  container: document.getElementById('map-container'),
  mapSrc: 'path/to/map.jpg',
  initialZoom: 1,
  minZoom: 0.5,
  maxZoom: 3,
  showControls: true,
  controlsPosition: 'bottom-right'
});

// Use methods to control the map
mapControls.zoomIn();
mapControls.zoomOut();
mapControls.panTo(x, y);
mapControls.reset();
```

### Event Handling

```typescript
// Listen for events
mapControls.on('zoom', (level) => {
  console.log(`Zoom level changed to: ${level}`);
});

mapControls.on('pan', (x, y) => {
  console.log(`Map panned to position: ${x}, ${y}`);
});
```

### Extending Functionality

```typescript
import { MapControls } from 'map-controls';

// Extend the base class
class CustomMapControls extends MapControls {
  constructor(options) {
    super(options);
    // Add custom initialization
  }

  // Override or add methods
  customFeature() {
    // Implementation
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage report
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Run example and documentation servers simultaneously
npm run start-all

# Check for outdated dependencies and security vulnerabilities
npm run check-deps

# Create a release bundle
npm run release

# Run complete development workflow
npm run workflow

# Generate changelog from git commits
npm run changelog

# Initialize an empty CHANGELOG.md file
npm run init-changelog

# Run all steps to prepare for a release
npm run prepare-release
```

## Documentation

Comprehensive documentation is available in the `documentation` directory:

```bash
# All-in-one command: build, generate sitemap, and serve documentation
npm run docs

# Or use individual commands:

# Build the documentation (converts Markdown to HTML)
npm run build-docs

# Generate sitemap for documentation
npm run generate-sitemap

# Check for broken links in the documentation
npm run check-links

# Serve the documentation locally and open in browser
npm run serve-docs
```

The documentation includes:

- Getting Started Guide
- Installation Instructions
- API Reference
- Examples
- Advanced Usage Guide
- Setup Instructions

## Browser Support

- Chrome
- Firefox
- Edge
- Safari

## License

MIT
