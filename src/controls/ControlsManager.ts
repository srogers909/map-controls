/**
 * Controls Manager for the Map Controls module
 */

import { MapControlsOptions, Position } from '../core/types';
import { DEFAULT_OPTIONS } from '../core/constants';
import { createControlsContainer } from '../utils/dom';
import { ZoomControls } from './ZoomControls';
import { PanControls } from './PanControls';

/**
 * Manages the UI controls for the map
 */
export class ControlsManager {
  private container: HTMLElement;
  private controlsContainer: HTMLElement | null = null;
  private zoomControls: ZoomControls | null = null;
  private panControls: PanControls | null = null;
  private options: MapControlsOptions;
  private onZoomIn: () => void;
  private onZoomOut: () => void;
  private onPan: (direction: 'up' | 'right' | 'down' | 'left') => void;
  private onReset: () => void;

  /**
   * Constructor
   */
  constructor(
    container: HTMLElement,
    options: MapControlsOptions,
    onZoomIn: () => void,
    onZoomOut: () => void,
    onPan: (direction: 'up' | 'right' | 'down' | 'left') => void,
    onReset: () => void
  ) {
    this.container = container;
    this.options = options;
    this.onZoomIn = onZoomIn;
    this.onZoomOut = onZoomOut;
    this.onPan = onPan;
    this.onReset = onReset;
  }

  /**
   * Initialize the controls
   */
  public init(): void {
    if (!this.options.showControls) {
      return;
    }

    const position = this.options.controlsPosition || DEFAULT_OPTIONS.controlsPosition;
    
    // Create controls container
    this.controlsContainer = createControlsContainer(position);
    
    // Create zoom controls
    this.zoomControls = new ZoomControls(
      this.controlsContainer,
      this.onZoomIn,
      this.onZoomOut
    );
    
    // Create pan controls
    this.panControls = new PanControls(
      this.controlsContainer,
      this.onPan,
      this.onReset
    );
    
    // Append to container
    this.container.appendChild(this.controlsContainer);
  }

  /**
   * Show the controls
   */
  public show(): void {
    if (this.controlsContainer) {
      this.controlsContainer.style.display = 'grid';
    }
  }

  /**
   * Hide the controls
   */
  public hide(): void {
    if (this.controlsContainer) {
      this.controlsContainer.style.display = 'none';
    }
  }

  /**
   * Update the controls position
   */
  public updatePosition(position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): void {
    if (!this.controlsContainer) {
      return;
    }
    
    // Remove old position classes
    this.controlsContainer.className = this.controlsContainer.className
      .split(' ')
      .filter(cls => !cls.includes('map-controls-top') && !cls.includes('map-controls-bottom'))
      .join(' ');
    
    // Add new position class
    const newPositionClass = `map-controls-${position}`;
    this.controlsContainer.classList.add(newPositionClass);
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.controlsContainer && this.container.contains(this.controlsContainer)) {
      this.container.removeChild(this.controlsContainer);
    }
    
    this.controlsContainer = null;
    this.zoomControls = null;
    this.panControls = null;
  }
}
