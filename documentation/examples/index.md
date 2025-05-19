# Examples

This section provides practical examples of how to use the Map Controls module in different scenarios.

## Basic Examples

<div class="examples-grid">
  <a href="basic-usage.md" class="example-item">
    <h3>Basic Usage</h3>
    <p>Simple implementation of map controls with default settings</p>
  </a>
  <a href="custom-controls.md" class="example-item">
    <h3>Custom Controls</h3>
    <p>Customizing the control buttons and their positions</p>
  </a>
  <a href="event-handling.md" class="example-item">
    <h3>Event Handling</h3>
    <p>Working with zoom and pan events</p>
  </a>
</div>

## Advanced Examples

<div class="examples-grid">
  <a href="custom-initialization.md" class="example-item">
    <h3>Custom Initialization</h3>
    <p>Advanced initialization options and configurations</p>
  </a>
  <a href="extending-mapcontrols.md" class="example-item">
    <h3>Extending MapControls</h3>
    <p>Creating custom subclasses with additional functionality</p>
  </a>
  <a href="performance-optimization.md" class="example-item">
    <h3>Performance Optimization</h3>
    <p>Techniques for optimizing performance with large maps</p>
  </a>
</div>

## Integration Examples

<div class="examples-grid">
  <a href="react-integration.md" class="example-item">
    <h3>React Integration</h3>
    <p>Using Map Controls with React</p>
  </a>
  <a href="vue-integration.md" class="example-item">
    <h3>Vue Integration</h3>
    <p>Using Map Controls with Vue.js</p>
  </a>
  <a href="angular-integration.md" class="example-item">
    <h3>Angular Integration</h3>
    <p>Using Map Controls with Angular</p>
  </a>
</div>

## Basic Usage Example

Here's a simple example of how to use the Map Controls module:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map Controls Basic Example</title>
  <style>
    #map-container {
      width: 800px;
      height: 500px;
      border: 1px solid #ccc;
      margin: 20px auto;
    }
  </style>
</head>
<body>
  <div id="map-container"></div>
  
  <script src="node_modules/map-controls/dist/index.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Get the container element
      const container = document.getElementById('map-container');
      
      // Create a new MapControls instance
      const mapControls = new MapControls.MapControls({
        container: container,
        mapSrc: 'path/to/map.jpg',
        initialZoom: 1,
        minZoom: 0.5,
        maxZoom: 3,
        showControls: true,
        controlsPosition: 'bottom-right'
      });
      
      // Listen for events
      mapControls.on('load', () => {
        console.log('Map loaded successfully');
      });
      
      mapControls.on('zoom', (level) => {
        console.log(`Zoom level: ${level}`);
      });
      
      mapControls.on('pan', (position) => {
        console.log(`Position: ${position.x}, ${position.y}`);
      });
    });
  </script>
</body>
</html>
```

## Custom Controls Example

This example shows how to customize the control buttons:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map Controls Custom Controls Example</title>
  <style>
    #map-container {
      width: 800px;
      height: 500px;
      border: 1px solid #ccc;
      margin: 20px auto;
    }
    
    .custom-controls {
      margin: 10px auto;
      width: 800px;
      text-align: center;
    }
    
    button {
      padding: 8px 16px;
      margin: 0 5px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="custom-controls">
    <button id="zoom-in">Zoom In</button>
    <button id="zoom-out">Zoom Out</button>
    <button id="pan-up">Pan Up</button>
    <button id="pan-right">Pan Right</button>
    <button id="pan-down">Pan Down</button>
    <button id="pan-left">Pan Left</button>
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
        mapSrc: 'path/to/map.jpg',
        initialZoom: 1,
        minZoom: 0.5,
        maxZoom: 3,
        showControls: false // Hide default controls
      });
      
      // Set up custom controls
      document.getElementById('zoom-in').addEventListener('click', () => {
        mapControls.zoomIn();
      });
      
      document.getElementById('zoom-out').addEventListener('click', () => {
        mapControls.zoomOut();
      });
      
      document.getElementById('pan-up').addEventListener('click', () => {
        const state = mapControls.getState();
        mapControls.panTo(state.position.x, state.position.y + 50);
      });
      
      document.getElementById('pan-right').addEventListener('click', () => {
        const state = mapControls.getState();
        mapControls.panTo(state.position.x - 50, state.position.y);
      });
      
      document.getElementById('pan-down').addEventListener('click', () => {
        const state = mapControls.getState();
        mapControls.panTo(state.position.x, state.position.y - 50);
      });
      
      document.getElementById('pan-left').addEventListener('click', () => {
        const state = mapControls.getState();
        mapControls.panTo(state.position.x + 50, state.position.y);
      });
      
      document.getElementById('reset').addEventListener('click', () => {
        mapControls.reset();
      });
      
      let controlsVisible = false;
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

## Event Handling Example

This example demonstrates how to handle events:

```javascript
// Initialize map controls
const mapControls = new MapControls({
  container: document.getElementById('map-container'),
  mapSrc: 'path/to/map.jpg'
});

// Create a status display
const statusElement = document.createElement('div');
statusElement.className = 'status';
document.body.appendChild(statusElement);

// Update status display with current state
function updateStatus() {
  const state = mapControls.getState();
  statusElement.innerHTML = `
    <h3>Map State:</h3>
    <p>Zoom: ${state.zoom.toFixed(2)}</p>
    <p>Position: X=${state.position.x.toFixed(0)}, Y=${state.position.y.toFixed(0)}</p>
    <p>Map Size: ${state.mapSize.width}x${state.mapSize.height}</p>
    <p>Container Size: ${state.containerSize.width}x${state.containerSize.height}</p>
  `;
}

// Listen for events
mapControls.on('load', () => {
  console.log('Map loaded');
  updateStatus();
});

mapControls.on('zoom', (level) => {
  console.log(`Zoom level: ${level}`);
  updateStatus();
});

mapControls.on('pan', (position) => {
  console.log(`Position: ${position.x}, ${position.y}`);
  updateStatus();
});

mapControls.on('error', (error) => {
  console.error('Map error:', error);
  statusElement.innerHTML = `<p class="error">Error: ${error.message}</p>`;
});
```

## See Also

For more detailed examples and advanced usage scenarios, check out the individual example pages linked above. Each example includes complete code samples and explanations.

For API documentation, see the [API Reference](../api/index.md).
