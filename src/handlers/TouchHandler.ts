/**
 * Touch Handler for the Map Controls module
 */

import { Position, MapState } from '../core/types';
import { calculateBoundaries, constrainPosition, calculateDistance, calculateMidpoint } from '../utils/math';

/**
 * Handles touch events for panning and zooming
 */
export class TouchHandler {
  private container: HTMLElement;
  private mapElement: HTMLElement;
  private isPanning: boolean = false;
  private lastPosition: Position | null = null;
  private lastTouchDistance: number | null = null;
  private onPan: (position: Position) => void;
  private onZoom: (zoom: number, center: Position) => void;
  private state: MapState;

  /**
   * Constructor
   */
  constructor(
    container: HTMLElement,
    mapElement: HTMLElement,
    state: MapState,
    onPan: (position: Position) => void,
    onZoom: (zoom: number, center: Position) => void
  ) {
    this.container = container;
    this.mapElement = mapElement;
    this.state = state;
    this.onPan = onPan;
    this.onZoom = onZoom;

    this.init();
  }

  /**
   * Initialize event listeners
   */
  private init(): void {
    this.container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.container.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
  }

  /**
   * Handle touch start event
   */
  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Single touch - start panning
      this.isPanning = true;
      this.lastPosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      this.lastTouchDistance = null;
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      this.isPanning = false;
      this.lastPosition = null;
      
      // Calculate initial distance between touches
      const touch1 = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      
      const touch2 = {
        x: e.touches[1].clientX,
        y: e.touches[1].clientY
      };
      
      this.lastTouchDistance = calculateDistance(touch1, touch2);
    }
  };

  /**
   * Handle touch move event
   */
  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    
    if (e.touches.length === 1 && this.isPanning && this.lastPosition) {
      // Single touch - panning
      const touch = e.touches[0];
      
      const deltaX = touch.clientX - this.lastPosition.x;
      const deltaY = touch.clientY - this.lastPosition.y;
      
      // Update last position
      this.lastPosition = {
        x: touch.clientX,
        y: touch.clientY
      };
      
      // Calculate new position
      const newPosition = {
        x: this.state.position.x + deltaX,
        y: this.state.position.y + deltaY
      };
      
      // Calculate boundaries
      const boundaries = calculateBoundaries(this.state);
      
      // Constrain position within boundaries
      const constrainedPosition = constrainPosition(newPosition, boundaries);
      
      // Update state via callback
      this.onPan(constrainedPosition);
    } else if (e.touches.length === 2 && this.lastTouchDistance !== null) {
      // Two touches - pinch zoom
      const touch1 = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      
      const touch2 = {
        x: e.touches[1].clientX,
        y: e.touches[1].clientY
      };
      
      // Calculate current distance between touches
      const currentDistance = calculateDistance(touch1, touch2);
      
      // Calculate zoom factor
      const zoomFactor = currentDistance / this.lastTouchDistance;
      
      // Update last touch distance
      this.lastTouchDistance = currentDistance;
      
      // Calculate new zoom level
      const newZoom = this.state.zoom * zoomFactor;
      
      // Calculate midpoint between touches relative to container
      const rect = this.container.getBoundingClientRect();
      const midpoint = calculateMidpoint(touch1, touch2);
      const zoomCenter = {
        x: midpoint.x - rect.left,
        y: midpoint.y - rect.top
      };
      
      // Trigger zoom callback with midpoint as center
      this.onZoom(newZoom, zoomCenter);
    }
  };

  /**
   * Handle touch end event
   */
  private handleTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    
    // Reset state
    this.isPanning = false;
    this.lastPosition = null;
    this.lastTouchDistance = null;
  };

  /**
   * Update the state reference
   */
  public updateState(state: MapState): void {
    this.state = state;
  }

  /**
   * Clean up event listeners
   */
  public destroy(): void {
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('touchcancel', this.handleTouchEnd);
  }
}
