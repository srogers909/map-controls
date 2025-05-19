/**
 * Mouse Handler for the Map Controls module
 */

import { Position, MapState } from '../core/types';
import { calculateBoundaries, constrainPosition } from '../utils/math';

/**
 * Handles mouse events for panning and zooming
 */
export class MouseHandler {
  private container: HTMLElement;
  private mapElement: HTMLElement;
  private isDragging: boolean = false;
  private lastPosition: Position | null = null;
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
    // Mouse down event
    this.mapElement.addEventListener('mousedown', this.handleMouseDown);
    
    // Mouse move and up events (attached to document to capture events outside container)
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    
    // Wheel event for zooming
    this.container.addEventListener('wheel', this.handleWheel, { passive: false });
    
    // Prevent context menu on right-click
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Handle mouse down event
   */
  private handleMouseDown = (e: MouseEvent): void => {
    // Only handle left mouse button
    if (e.button !== 0) return;
    
    e.preventDefault();
    
    this.isDragging = true;
    this.lastPosition = { x: e.clientX, y: e.clientY };
    
    // Change cursor
    this.mapElement.style.cursor = 'grabbing';
  };

  /**
   * Handle mouse move event
   */
  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging || !this.lastPosition) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - this.lastPosition.x;
    const deltaY = e.clientY - this.lastPosition.y;
    
    // Update last position
    this.lastPosition = { x: e.clientX, y: e.clientY };
    
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
  };

  /**
   * Handle mouse up event
   */
  private handleMouseUp = (e: MouseEvent): void => {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    this.isDragging = false;
    this.lastPosition = null;
    
    // Reset cursor
    this.mapElement.style.cursor = 'grab';
  };

  /**
   * Handle wheel event for zooming
   */
  private handleWheel = (e: WheelEvent): void => {
    e.preventDefault();
    
    // Get mouse position relative to container
    const rect = this.container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate zoom direction and factor
    const delta = -Math.sign(e.deltaY);
    const zoomFactor = 0.1; // 10% zoom per wheel tick
    
    // Calculate new zoom level
    const newZoom = this.state.zoom * (1 + delta * zoomFactor);
    
    // Trigger zoom callback with mouse position as center
    this.onZoom(newZoom, { x: mouseX, y: mouseY });
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
    this.mapElement.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.container.removeEventListener('wheel', this.handleWheel);
  }
}
