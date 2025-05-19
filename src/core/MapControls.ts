/**
 * Main Map Controls class
 */

import { 
  MapControlsOptions, 
  MapState, 
  Position, 
  Size, 
  EventType, 
  EventHandler 
} from './types';
import { DEFAULT_OPTIONS, DEFAULT_STYLES } from './constants';
import { EventManager } from '../handlers/EventManager';
import { MouseHandler } from '../handlers/MouseHandler';
import { TouchHandler } from '../handlers/TouchHandler';
import { CanvasRenderer } from '../renderers/CanvasRenderer';
import { ControlsManager } from '../controls/ControlsManager';
import { 
  createContainer, 
  getElementSize, 
  addStyles 
} from '../utils/dom';
import { 
  clamp, 
  calculateBoundaries, 
  constrainPosition, 
  calculateZoomPosition 
} from '../utils/math';

/**
 * Main class for the Map Controls module
 */
export class MapControls {
  private options: MapControlsOptions;
  private container: HTMLElement;
  private originalContainer: HTMLElement;
  private state: MapState;
  private eventManager: EventManager;
  private renderer: CanvasRenderer;
  private mouseHandler: MouseHandler | null = null;
  private touchHandler: TouchHandler | null = null;
  private controlsManager: ControlsManager | null = null;
  private initialized: boolean = false;

  /**
   * Constructor
   */
  constructor(options: MapControlsOptions) {
    // Store original container
    this.originalContainer = options.container;
    
    // Merge options with defaults
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    } as MapControlsOptions;
    
    // Create container
    this.container = createContainer(this.originalContainer);
    
    // Initialize event manager
    this.eventManager = new EventManager();
    
    // Initialize renderer
    this.renderer = new CanvasRenderer();
    
    // Initialize state with default values
    this.state = {
      zoom: this.options.initialZoom || DEFAULT_OPTIONS.initialZoom,
      position: { x: 0, y: 0 },
      mapSize: { width: 0, height: 0 },
      containerSize: getElementSize(this.container)
    };
    
    // Add default styles
    addStyles(DEFAULT_STYLES);
    
    // Initialize
    this.init();
  }

  /**
   * Initialize the map controls
   */
  private async init(): Promise<void> {
    try {
      // Initialize renderer
      await this.renderer.init(this.container, this.options.mapSrc);
      
      // Get map element
      const mapElement = this.renderer.getMapElement();
      if (!mapElement) {
        throw new Error('Failed to create map element');
      }
      
      // Update state with map size
      this.state.mapSize = this.renderer.getMapSize();
      
      // Initialize mouse handler
      this.mouseHandler = new MouseHandler(
        this.container,
        mapElement,
        this.state,
        this.handlePanFromEvent,
        this.handleZoomFromEvent
      );
      
      // Initialize touch handler
      this.touchHandler = new TouchHandler(
        this.container,
        mapElement,
        this.state,
        this.handlePanFromEvent,
        this.handleZoomFromEvent
      );
      
      // Initialize controls manager
      this.controlsManager = new ControlsManager(
        this.container,
        this.options,
        this.handleZoomIn,
        this.handleZoomOut,
        this.handlePanDirection,
        this.handleReset
      );
      
      this.controlsManager.init();
      
      // Set initial position or center the map
      if (this.options.initialPosition) {
        this.updatePosition(this.options.initialPosition);
      } else {
        this.centerMap();
      }
      
      // Mark as initialized
      this.initialized = true;
      
      // Dispatch load event
      this.eventManager.dispatch('load', this.state);
    } catch (error) {
      console.error('Failed to initialize map controls:', error);
      this.eventManager.dispatch('error', error);
    }
  }

  /**
   * Center the map in the container
   */
  private centerMap(): void {
    const { containerSize, mapSize } = this.state;
    
    // Calculate center position
    const x = (containerSize.width - mapSize.width) / 2;
    const y = (containerSize.height - mapSize.height) / 2;
    
    // Update position
    this.updatePosition({ x, y });
  }

  /**
   * Update the map position
   */
  private updatePosition(position: Position): void {
    // Calculate boundaries
    const boundaries = calculateBoundaries(this.state);
    
    // Constrain position within boundaries
    const constrainedPosition = constrainPosition(position, boundaries);
    
    // Update state
    this.state.position = constrainedPosition;
    
    // Render
    this.render();
    
    // Dispatch pan event
    this.eventManager.dispatch('pan', constrainedPosition);
  }

  /**
   * Update the zoom level
   */
  private updateZoom(zoom: number, center?: Position): void {
    const { minZoom, maxZoom } = this.options;
    
    // Clamp zoom level
    const clampedZoom = clamp(
      zoom,
      minZoom || DEFAULT_OPTIONS.minZoom,
      maxZoom || DEFAULT_OPTIONS.maxZoom
    );
    
    // Calculate new position to maintain center point
    const newPosition = calculateZoomPosition(this.state, clampedZoom, center);
    
    // Update state
    this.state.zoom = clampedZoom;
    
    // Update position
    this.updatePosition(newPosition);
    
    // Dispatch zoom event
    this.eventManager.dispatch('zoom', clampedZoom);
  }

  /**
   * Render the map
   */
  private render(): void {
    if (!this.initialized) return;
    
    this.renderer.render(this.state);
  }

  /**
   * Handle pan from event handlers
   */
  private handlePanFromEvent = (position: Position): void => {
    this.updatePosition(position);
  };

  /**
   * Handle zoom from event handlers
   */
  private handleZoomFromEvent = (zoom: number, center: Position): void => {
    this.updateZoom(zoom, center);
  };

  /**
   * Handle zoom in button click
   */
  private handleZoomIn = (): void => {
    const { zoomStep } = this.options;
    const step = zoomStep || DEFAULT_OPTIONS.zoomStep;
    this.updateZoom(this.state.zoom + step);
  };

  /**
   * Handle zoom out button click
   */
  private handleZoomOut = (): void => {
    const { zoomStep } = this.options;
    const step = zoomStep || DEFAULT_OPTIONS.zoomStep;
    this.updateZoom(this.state.zoom - step);
  };

  /**
   * Handle pan direction button click
   */
  private handlePanDirection = (direction: 'up' | 'right' | 'down' | 'left'): void => {
    const { panStep } = this.options;
    const step = panStep || DEFAULT_OPTIONS.panStep;
    const { position } = this.state;
    
    let newPosition: Position;
    
    switch (direction) {
      case 'up':
        newPosition = { x: position.x, y: position.y + step };
        break;
      case 'right':
        newPosition = { x: position.x - step, y: position.y };
        break;
      case 'down':
        newPosition = { x: position.x, y: position.y - step };
        break;
      case 'left':
        newPosition = { x: position.x + step, y: position.y };
        break;
      default:
        return;
    }
    
    this.updatePosition(newPosition);
  };

  /**
   * Handle reset button click
   */
  private handleReset = (): void => {
    // Reset zoom
    this.state.zoom = this.options.initialZoom || DEFAULT_OPTIONS.initialZoom;
    
    // Reset position to initial position or center
    if (this.options.initialPosition) {
      this.updatePosition(this.options.initialPosition);
    } else {
      this.centerMap();
    }
  };

  /**
   * Add an event listener
   */
  public on(type: EventType, handler: EventHandler): void {
    this.eventManager.on(type, handler);
  }

  /**
   * Remove an event listener
   */
  public off(type: EventType, handler: EventHandler): void {
    this.eventManager.off(type, handler);
  }

  /**
   * Zoom in
   */
  public zoomIn(factor?: number): void {
    const step = factor || (this.options.zoomStep || DEFAULT_OPTIONS.zoomStep);
    this.updateZoom(this.state.zoom + step);
  }

  /**
   * Zoom out
   */
  public zoomOut(factor?: number): void {
    const step = factor || (this.options.zoomStep || DEFAULT_OPTIONS.zoomStep);
    this.updateZoom(this.state.zoom - step);
  }

  /**
   * Pan to a specific position
   */
  public panTo(x: number, y: number): void {
    this.updatePosition({ x, y });
  }

  /**
   * Reset the map
   */
  public reset(): void {
    this.handleReset();
  }

  /**
   * Set the map source
   */
  public async setMapSrc(mapSrc: string): Promise<void> {
    try {
      // Update map source
      await this.renderer.changeMapSource(mapSrc);
      
      // Update state with new map size
      this.state.mapSize = this.renderer.getMapSize();
      
      // Center the map
      this.centerMap();
      
      // Dispatch load event
      this.eventManager.dispatch('load', this.state);
    } catch (error) {
      console.error('Failed to change map source:', error);
      this.eventManager.dispatch('error', error);
    }
  }

  /**
   * Show controls
   */
  public showControls(): void {
    if (this.controlsManager) {
      this.controlsManager.show();
    }
  }

  /**
   * Hide controls
   */
  public hideControls(): void {
    if (this.controlsManager) {
      this.controlsManager.hide();
    }
  }

  /**
   * Get current state
   */
  public getState(): MapState {
    return { ...this.state };
  }

  /**
   * Destroy the map controls
   */
  public destroy(): void {
    // Clean up event handlers
    if (this.mouseHandler) {
      this.mouseHandler.destroy();
      this.mouseHandler = null;
    }
    
    if (this.touchHandler) {
      this.touchHandler.destroy();
      this.touchHandler = null;
    }
    
    // Clean up controls
    if (this.controlsManager) {
      this.controlsManager.destroy();
      this.controlsManager = null;
    }
    
    // Clean up renderer
    this.renderer.destroy();
    
    // Clean up event listeners
    this.eventManager.removeAllListeners();
    
    // Reset container
    this.originalContainer.innerHTML = '';
    
    // Reset initialized flag
    this.initialized = false;
  }
}
