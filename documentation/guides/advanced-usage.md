# Advanced Usage

This guide covers advanced usage scenarios and customization options for the Map Controls module.

## Custom Initialization

### Setting Initial Position

By default, the map is centered in the container when initialized. However, you can specify an initial position using the `initialPosition` option:

```typescript
const mapControls = new MapControls({
  container: document.getElementById('map-container'),
  mapSrc: 'path/to/map.jpg',
  initialPosition: { x: -500, y: -300 } // Start at specific coordinates
});
```

This is useful when you want to focus on a specific area of the map when it first loads.

### Custom Zoom Levels

You can customize the zoom behavior by setting the minimum and maximum zoom levels, as well as the initial zoom level:

```typescript
const mapControls = new MapControls({
  container: document.getElementById('map-container'),
  mapSrc: 'path/to/map.jpg',
  initialZoom: 1.2,  // Start zoomed in slightly
  minZoom: 0.5,      // Minimum zoom level (zoomed out)
  maxZoom: 4,        // Maximum zoom level (zoomed in)
  zoomStep: 0.2      // Larger steps for zoom operations
});
```

## Custom Controls

### Control Positioning

You can position the controls in one of four corners of the map:

```typescript
const mapControls = new MapControls({
  container: document.getElementById('map-container'),
  mapSrc: 'path/to/map.jpg',
  showControls: true,
  controlsPosition: 'top-left' // 'top-left', 'top-right', 'bottom-left', or 'bottom-right'
});
```

### Hiding and Showing Controls

You can programmatically hide and show the controls:

```typescript
// Hide controls
mapControls.hideControls();

// Show controls
mapControls.showControls();

// Toggle controls
let controlsVisible = true;
document.getElementById('toggle-controls').addEventListener('click', () => {
  if (controlsVisible) {
    mapControls.hideControls();
  } else {
    mapControls.showControls();
  }
  controlsVisible = !controlsVisible;
});
```

## Advanced Event Handling

### Custom Event Handling

You can create custom event handlers for more complex interactions:

```typescript
// Track zoom history
const zoomHistory = [];

mapControls.on('zoom', (level) => {
  zoomHistory.push({
    level,
    timestamp: new Date()
  });
  
  console.log(`Zoom history: ${zoomHistory.length} entries`);
});

// Track pan positions
const panPositions = [];

mapControls.on('pan', (position) => {
  panPositions.push({
    x: position.x,
    y: position.y,
    timestamp: new Date()
  });
  
  // Limit the history to last 10 positions
  if (panPositions.length > 10) {
    panPositions.shift();
  }
});
```

### Combining Multiple Events

You can combine multiple events to create more complex behaviors:

```typescript
// Create a state tracking object
const mapActivity = {
  lastZoom: 1,
  lastPosition: { x: 0, y: 0 },
  isActive: false,
  lastActiveTime: null,
  activityTimeout: null
};

// Track user activity
function trackActivity() {
  mapActivity.isActive = true;
  mapActivity.lastActiveTime = new Date();
  
  // Reset the activity timeout
  clearTimeout(mapActivity.activityTimeout);
  
  // Set a new timeout to mark as inactive after 5 seconds
  mapActivity.activityTimeout = setTimeout(() => {
    mapActivity.isActive = false;
    console.log('Map is now inactive');
  }, 5000);
}

// Listen for events
mapControls.on('zoom', (level) => {
  mapActivity.lastZoom = level;
  trackActivity();
});

mapControls.on('pan', (position) => {
  mapActivity.lastPosition = position;
  trackActivity();
});

// Initial load
mapControls.on('load', () => {
  console.log('Map loaded, ready for interaction');
  mapActivity.lastZoom = mapControls.getState().zoom;
  mapActivity.lastPosition = mapControls.getState().position;
});
```

## Extending the MapControls Class

You can extend the MapControls class to add custom functionality:

```typescript
class CustomMapControls extends MapControls {
  private markers = [];
  
  constructor(options) {
    super(options);
    
    // Add custom initialization
    this.on('load', () => {
      this.initializeMarkers();
    });
  }
  
  // Add a marker to the map
  addMarker(x, y, label) {
    const state = this.getState();
    const marker = document.createElement('div');
    
    marker.className = 'map-marker';
    marker.textContent = label;
    marker.style.position = 'absolute';
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    
    // Add to the container
    const container = this.getContainer();
    container.appendChild(marker);
    
    // Store the marker
    this.markers.push({ element: marker, x, y, label });
    
    // Update marker positions
    this.updateMarkerPositions();
    
    return marker;
  }
  
  // Get the container element (new method)
  getContainer() {
    return this.container; // You might need to make container protected instead of private
  }
  
  // Initialize markers from data
  initializeMarkers() {
    // Example: Load markers from a data source
    const markerData = [
      { x: 100, y: 150, label: 'A' },
      { x: 250, y: 300, label: 'B' },
      { x: 400, y: 200, label: 'C' }
    ];
    
    markerData.forEach(marker => {
      this.addMarker(marker.x, marker.y, marker.label);
    });
  }
  
  // Update marker positions based on current zoom and pan
  updateMarkerPositions() {
    const state = this.getState();
    
    this.markers.forEach(marker => {
      const x = marker.x * state.zoom + state.position.x;
      const y = marker.y * state.zoom + state.position.y;
      
      marker.element.style.transform = `translate(${x}px, ${y}px) scale(${state.zoom})`;
    });
  }
  
  // Override the render method to update markers
  render() {
    super.render();
    this.updateMarkerPositions();
  }
}
```

## Integration with Other Libraries

### Using with React

```jsx
import React, { useEffect, useRef } from 'react';
import { MapControls } from 'map-controls';

function MapComponent({ mapSrc, onZoomChange, onPanChange }) {
  const containerRef = useRef(null);
  const mapControlsRef = useRef(null);
  
  useEffect(() => {
    // Initialize map controls when the component mounts
    if (containerRef.current) {
      mapControlsRef.current = new MapControls({
        container: containerRef.current,
        mapSrc: mapSrc,
        initialZoom: 1,
        showControls: true
      });
      
      // Set up event listeners
      mapControlsRef.current.on('zoom', (level) => {
        if (onZoomChange) {
          onZoomChange(level);
        }
      });
      
      mapControlsRef.current.on('pan', (position) => {
        if (onPanChange) {
          onPanChange(position);
        }
      });
    }
    
    // Clean up when the component unmounts
    return () => {
      if (mapControlsRef.current) {
        mapControlsRef.current.destroy();
      }
    };
  }, [mapSrc, onZoomChange, onPanChange]);
  
  return (
    <div className="map-container" ref={containerRef} style={{ width: '100%', height: '500px' }}></div>
  );
}

export default MapComponent;
```

### Using with Vue.js

```vue
<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import { MapControls } from 'map-controls';

export default {
  name: 'MapComponent',
  props: {
    mapSrc: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mapControls: null
    };
  },
  mounted() {
    // Initialize map controls
    this.mapControls = new MapControls({
      container: this.$refs.mapContainer,
      mapSrc: this.mapSrc,
      initialZoom: 1,
      showControls: true
    });
    
    // Set up event listeners
    this.mapControls.on('zoom', this.handleZoom);
    this.mapControls.on('pan', this.handlePan);
  },
  beforeDestroy() {
    // Clean up
    if (this.mapControls) {
      this.mapControls.off('zoom', this.handleZoom);
      this.mapControls.off('pan', this.handlePan);
      this.mapControls.destroy();
    }
  },
  methods: {
    handleZoom(level) {
      this.$emit('zoom-change', level);
    },
    handlePan(position) {
      this.$emit('pan-change', position);
    },
    zoomIn() {
      if (this.mapControls) {
        this.mapControls.zoomIn();
      }
    },
    zoomOut() {
      if (this.mapControls) {
        this.mapControls.zoomOut();
      }
    },
    reset() {
      if (this.mapControls) {
        this.mapControls.reset();
      }
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  position: relative;
}
</style>
```

## Performance Optimization

### Debouncing Events

For better performance, you can debounce event handlers to reduce the frequency of updates:

```typescript
// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Create debounced handlers
const debouncedZoomHandler = debounce((level) => {
  console.log(`Debounced zoom level: ${level}`);
  // Update UI or perform other operations
}, 100);

const debouncedPanHandler = debounce((position) => {
  console.log(`Debounced position: ${position.x}, ${position.y}`);
  // Update UI or perform other operations
}, 100);

// Add event listeners
mapControls.on('zoom', debouncedZoomHandler);
mapControls.on('pan', debouncedPanHandler);
```

### Optimizing for Large Maps

When working with very large maps, consider these optimizations:

1. **Lazy Loading**: Load map sections as needed instead of the entire map at once
2. **Image Optimization**: Use optimized image formats and compression
3. **Canvas Rendering**: Use the canvas renderer for better performance with large images
4. **Throttle Events**: Throttle pan and zoom events to reduce rendering frequency

```typescript
// Example of implementing lazy loading with multiple map tiles
class TiledMapControls extends MapControls {
  private tiles = [];
  private tileSize = 256;
  private loadedTiles = new Set();
  
  constructor(options) {
    super(options);
    
    // Override the mapSrc with a base URL for tiles
    this.tileBaseUrl = options.tileBaseUrl || '';
    
    // Listen for pan and zoom events to load tiles
    this.on('pan', debounce(() => this.updateVisibleTiles(), 200));
    this.on('zoom', debounce(() => this.updateVisibleTiles(), 200));
    this.on('load', () => this.updateVisibleTiles());
  }
  
  // Calculate which tiles are visible and load them
  updateVisibleTiles() {
    const state = this.getState();
    const visibleTiles = this.calculateVisibleTiles(state);
    
    // Load new tiles
    visibleTiles.forEach(tile => {
      const tileKey = `${tile.x},${tile.y},${tile.z}`;
      
      if (!this.loadedTiles.has(tileKey)) {
        this.loadTile(tile.x, tile.y, tile.z);
        this.loadedTiles.add(tileKey);
      }
    });
  }
  
  // Calculate which tiles are visible based on current state
  calculateVisibleTiles(state) {
    // Implementation depends on your tiling scheme
    // This is a simplified example
    const visibleTiles = [];
    const zoom = Math.floor(state.zoom);
    
    // Calculate tile coordinates based on position and zoom
    const startX = Math.floor(-state.position.x / (this.tileSize * state.zoom));
    const startY = Math.floor(-state.position.y / (this.tileSize * state.zoom));
    const endX = startX + Math.ceil(state.containerSize.width / (this.tileSize * state.zoom));
    const endY = startY + Math.ceil(state.containerSize.height / (this.tileSize * state.zoom));
    
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        visibleTiles.push({ x, y, z: zoom });
      }
    }
    
    return visibleTiles;
  }
  
  // Load a specific tile
  loadTile(x, y, z) {
    const tileUrl = `${this.tileBaseUrl}/${z}/${x}/${y}.png`;
    const tile = document.createElement('img');
    
    tile.src = tileUrl;
    tile.style.position = 'absolute';
    tile.style.left = `${x * this.tileSize}px`;
    tile.style.top = `${y * this.tileSize}px`;
    tile.style.width = `${this.tileSize}px`;
    tile.style.height = `${this.tileSize}px`;
    
    // Add to the container
    const container = this.getContainer();
    container.appendChild(tile);
    
    // Store the tile
    this.tiles.push(tile);
  }
}
```

## See Also

- [API Reference](../api/index.md)
- [Examples](../examples/index.md)
- [Extending the Module](extending.md)
