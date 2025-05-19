/**
 * Constants for the Map Controls module
 */

/**
 * Default options for MapControls
 */
export const DEFAULT_OPTIONS = {
  initialZoom: 1,
  initialPosition: null, // null means center the map
  minZoom: 0.5,
  maxZoom: 1.5,
  showControls: true,
  controlsPosition: 'bottom-right',
  zoomStep: 0.1,
  panStep: 50
} as const;

/**
 * CSS class names
 */
export const CSS_CLASSES = {
  container: 'map-controls-container',
  map: 'map-controls-map',
  controls: 'map-controls-buttons',
  zoomIn: 'map-controls-zoom-in',
  zoomOut: 'map-controls-zoom-out',
  panUp: 'map-controls-pan-up',
  panRight: 'map-controls-pan-right',
  panDown: 'map-controls-pan-down',
  panLeft: 'map-controls-pan-left',
  reset: 'map-controls-reset',
  button: 'map-controls-button',
  topLeft: 'map-controls-top-left',
  topRight: 'map-controls-top-right',
  bottomLeft: 'map-controls-bottom-left',
  bottomRight: 'map-controls-bottom-right'
} as const;

/**
 * Default CSS styles
 */
export const DEFAULT_STYLES = `
  .${CSS_CLASSES.container} {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    touch-action: none;
  }
  
  .${CSS_CLASSES.map} {
    position: absolute;
    transform-origin: 0 0;
    cursor: grab;
  }
  
  .${CSS_CLASSES.map}:active {
    cursor: grabbing;
  }
  
  .${CSS_CLASSES.controls} {
    position: absolute;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    z-index: 1000;
  }
  
  .${CSS_CLASSES.topLeft} {
    top: 10px;
    left: 10px;
  }
  
  .${CSS_CLASSES.topRight} {
    top: 10px;
    right: 10px;
  }
  
  .${CSS_CLASSES.bottomLeft} {
    bottom: 10px;
    left: 10px;
  }
  
  .${CSS_CLASSES.bottomRight} {
    bottom: 10px;
    right: 10px;
  }
  
  .${CSS_CLASSES.button} {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
  }
  
  .${CSS_CLASSES.button}:hover {
    background: #f0f0f0;
  }
  
  .${CSS_CLASSES.button}:active {
    background: #e0e0e0;
  }
  
  .${CSS_CLASSES.panUp} {
    grid-column: 2;
    grid-row: 1;
  }
  
  .${CSS_CLASSES.panLeft} {
    grid-column: 1;
    grid-row: 2;
  }
  
  .${CSS_CLASSES.reset} {
    grid-column: 2;
    grid-row: 2;
  }
  
  .${CSS_CLASSES.panRight} {
    grid-column: 3;
    grid-row: 2;
  }
  
  .${CSS_CLASSES.panDown} {
    grid-column: 2;
    grid-row: 3;
  }
  
  .${CSS_CLASSES.zoomIn} {
    grid-column: 1;
    grid-row: 1;
  }
  
  .${CSS_CLASSES.zoomOut} {
    grid-column: 3;
    grid-row: 3;
  }
`;
