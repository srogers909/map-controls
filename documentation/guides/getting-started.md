# Getting Started with Map Controls

This guide will help you quickly integrate the Map Controls module into your project and start using its features.

## Prerequisites

Before you begin, make sure you have:

- Node.js (version 14 or higher)
- npm or yarn package manager
- A web project where you want to add map controls

## Installation

You can install the Map Controls module using npm or yarn:

```bash
# Using npm
npm install map-controls

# Using yarn
yarn add map-controls
```

For more detailed installation instructions, see the [Installation Guide](installation.md).

## Basic Usage

### 1. Import the Module

First, import the MapControls class from the module:

```typescript
// Using ES modules
import { MapControls } from 'map-controls';

// Using CommonJS
const { MapControls } = require('map-controls');
```

### 2. Create HTML Structure

Add a container element to your HTML where the map will be displayed:

```html
<div id="map-container" style="width: 800px; height: 500px;"></div>
```

### 3. Initialize Map Controls

Create a new instance of MapControls with your configuration:

```typescript
// Get the container element
const container = document.getElementById('map-container');

// Create a new MapControls instance
const mapControls = new MapControls({
  container: container,
  mapSrc: 'path/to/your-map-image.jpg',
  initialZoom: 1,
  minZoom: 0.5,
  maxZoom: 3,
  showControls: true,
  controlsPosition: 'bottom-right'
});
```

### 4. Handle Events

You can listen for events to respond to user interactions:

```typescript
// Listen for zoom events
mapControls.on('zoom', (level) => {
  console.log(`Zoom level changed to: ${level}`);
});

// Listen for pan events
mapControls.on('pan', (position) => {
  console.log(`Map panned to position: ${position.x}, ${position.y}`);
});

// Listen for load events
mapControls.on('load', () => {
  console.log('Map loaded successfully');
});

// Listen for error events
mapControls.on('error', (error) => {
  console.error('Map error:', error);
});
```

### 5. Control the Map Programmatically

You can control the map using the provided methods:

```typescript
// Zoom in
mapControls.zoomIn();

// Zoom out
mapControls.zoomOut();

// Pan to a specific position
mapControls.panTo(100, 200);

// Reset to initial state
mapControls.reset();

// Show/hide controls
mapControls.showControls();
mapControls.hideControls();
```

## Complete Example

Here's a complete example that puts everything together:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map Controls Example</title>
  <style>
    #map-container {
      width: 800px;
      height: 500px;
      border: 1px solid #ccc;
      margin: 20px auto;
    }
    
    .controls {
      margin: 10px auto;
      width: 800px;
      text-align: center;
    }
    
    button {
      padding: 8px 16px;
      margin: 0 5px;
    }
  </style>
</head>
<body>
  <div class="controls">
    <button id="zoom-in">Zoom In</button>
    <button id="zoom-out">Zoom Out</button>
    <button id="reset">Reset</button>
    <button id="toggle-controls">Toggle Controls</button>
  </div>
  
  <div id="map-container"></div>
  
  <script src="node_modules/map-controls/dist/index.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Get the container element
      const container = document.getElementById('map-container');
      
      // Create a new MapControls instance
      const mapControls = new MapControls.MapControls({
        container: container,
        mapSrc: 'assets/world-map.jpg',
        initialZoom: 1,
        minZoom: 0.5,
        maxZoom: 3,
        showControls: true,
        controlsPosition: 'bottom-right'
      });
      
      // Set up event listeners
      mapControls.on('zoom', (level) => {
        console.log(`Zoom level: ${level}`);
      });
      
      mapControls.on('pan', (position) => {
        console.log(`Position: ${position.x}, ${position.y}`);
      });
      
      // Set up UI controls
      document.getElementById('zoom-in').addEventListener('click', () => {
        mapControls.zoomIn();
      });
      
      document.getElementById('zoom-out').addEventListener('click', () => {
        mapControls.zoomOut();
      });
      
      document.getElementById('reset').addEventListener('click', () => {
        mapControls.reset();
      });
      
      let controlsVisible = true;
      document.getElementById('toggle-controls').addEventListener('click', () => {
        if (controlsVisible) {
          mapControls.hideControls();
          document.getElementById('toggle-controls').textContent = 'Show Controls';
        } else {
          mapControls.showControls();
          document.getElementById('toggle-controls').textContent = 'Hide Controls';
        }
        controlsVisible = !controlsVisible;
      });
    });
  </script>
</body>
</html>
```

## Next Steps

Now that you have a basic understanding of how to use Map Controls, you can:

- Learn about [advanced configuration options](advanced-usage.md)
- Explore the [API Reference](../api/index.md) for detailed information about all available methods and options
- Check out more [examples](../examples/index.md) for common use cases
- Learn how to [extend the functionality](extending.md) for custom requirements

## Troubleshooting

If you encounter any issues while setting up Map Controls, check the [Troubleshooting Guide](troubleshooting.md) for common problems and solutions.
