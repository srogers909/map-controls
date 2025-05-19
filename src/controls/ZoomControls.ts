/**
 * Zoom Controls for the Map Controls module
 */

import { createButton } from '../utils/dom';
import { CSS_CLASSES } from '../core/constants';

/**
 * Manages zoom in and zoom out buttons
 */
export class ZoomControls {
  private container: HTMLElement;
  private zoomInButton: HTMLElement | null = null;
  private zoomOutButton: HTMLElement | null = null;
  private onZoomIn: () => void;
  private onZoomOut: () => void;

  /**
   * Constructor
   */
  constructor(
    container: HTMLElement,
    onZoomIn: () => void,
    onZoomOut: () => void
  ) {
    this.container = container;
    this.onZoomIn = onZoomIn;
    this.onZoomOut = onZoomOut;

    this.init();
  }

  /**
   * Initialize the zoom controls
   */
  private init(): void {
    // Create zoom in button
    this.zoomInButton = createButton(
      CSS_CLASSES.zoomIn,
      '+',
      this.handleZoomIn
    );
    
    // Create zoom out button
    this.zoomOutButton = createButton(
      CSS_CLASSES.zoomOut,
      '-',
      this.handleZoomOut
    );
    
    // Append to container
    this.container.appendChild(this.zoomInButton);
    this.container.appendChild(this.zoomOutButton);
  }

  /**
   * Handle zoom in button click
   */
  private handleZoomIn = (e: MouseEvent): void => {
    e.preventDefault();
    this.onZoomIn();
  };

  /**
   * Handle zoom out button click
   */
  private handleZoomOut = (e: MouseEvent): void => {
    e.preventDefault();
    this.onZoomOut();
  };

  /**
   * Enable zoom in button
   */
  public enableZoomIn(): void {
    if (this.zoomInButton) {
      this.zoomInButton.removeAttribute('disabled');
    }
  }

  /**
   * Disable zoom in button
   */
  public disableZoomIn(): void {
    if (this.zoomInButton) {
      this.zoomInButton.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * Enable zoom out button
   */
  public enableZoomOut(): void {
    if (this.zoomOutButton) {
      this.zoomOutButton.removeAttribute('disabled');
    }
  }

  /**
   * Disable zoom out button
   */
  public disableZoomOut(): void {
    if (this.zoomOutButton) {
      this.zoomOutButton.setAttribute('disabled', 'disabled');
    }
  }
}
