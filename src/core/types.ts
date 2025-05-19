/**
 * Types and interfaces for the Map Controls module
 */

/**
 * Position coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Map Controls configuration options
 */
export interface MapControlsOptions {
  /** DOM element to contain the map */
  container: HTMLElement;
  /** Path to the map image */
  mapSrc: string;
  /** Initial zoom level (default: 1) */
  initialZoom?: number;
  /** Initial position (default: centered) */
  initialPosition?: Position;
  /** Minimum zoom level (default: 0.5) */
  minZoom?: number;
  /** Maximum zoom level (default: 3) */
  maxZoom?: number;
  /** Whether to show control buttons (default: true) */
  showControls?: boolean;
  /** Position of the controls (default: 'bottom-right') */
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Zoom step for zoom in/out operations (default: 0.1) */
  zoomStep?: number;
  /** Pan step for pan operations in pixels (default: 50) */
  panStep?: number;
}

/**
 * Map state
 */
export interface MapState {
  /** Current zoom level */
  zoom: number;
  /** Current position */
  position: Position;
  /** Map dimensions */
  mapSize: Size;
  /** Container dimensions */
  containerSize: Size;
}

/**
 * Event types
 */
export type EventType = 'zoom' | 'pan' | 'load' | 'error';

/**
 * Event handler function
 */
export type EventHandler = (...args: any[]) => void;

/**
 * Event listener
 */
export interface EventListener {
  type: EventType;
  handler: EventHandler;
}

/**
 * Renderer interface
 */
export interface Renderer {
  /** Initialize the renderer */
  init(container: HTMLElement, mapSrc: string): Promise<void>;
  /** Render the map with current state */
  render(state: MapState): void;
  /** Clean up resources */
  destroy(): void;
  /** Get the map size */
  getMapSize(): Size;
}
