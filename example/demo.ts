/**
 * Map Controls Demo
 */

// Import the MapControls class
import { MapControls } from '../src/core/MapControls';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Get the map container element
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  // Get the status element
  const statusElement = document.getElementById('status');
  if (!statusElement) {
    console.error('Status element not found');
    return;
  }

  // Create map controls instance
  const mapControls = new MapControls({
    container: mapContainer,
    mapSrc: 'world-map.jpeg',
    initialZoom: 1,
    minZoom: 0.5,
    maxZoom: 3,
    showControls: true,
    controlsPosition: 'bottom-right'
  });

  // Update status display
  const updateStatus = () => {
    const state = mapControls.getState();
    statusElement.textContent = JSON.stringify(state, null, 2);
  };

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
  });

  // Set up UI controls
  const toggleControlsButton = document.getElementById('toggle-controls');
  if (toggleControlsButton) {
    let controlsVisible = true;
    toggleControlsButton.addEventListener('click', () => {
      if (controlsVisible) {
        mapControls.hideControls();
        toggleControlsButton.textContent = 'Show Controls';
      } else {
        mapControls.showControls();
        toggleControlsButton.textContent = 'Hide Controls';
      }
      controlsVisible = !controlsVisible;
    });
  }

  const resetButton = document.getElementById('reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      mapControls.reset();
    });
  }
});
