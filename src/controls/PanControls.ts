/**
 * Pan Controls for the Map Controls module
 */

import { createButton } from '../utils/dom';
import { CSS_CLASSES } from '../core/constants';

/**
 * Manages pan direction buttons and reset button
 */
export class PanControls {
  private container: HTMLElement;
  private panUpButton: HTMLElement | null = null;
  private panRightButton: HTMLElement | null = null;
  private panDownButton: HTMLElement | null = null;
  private panLeftButton: HTMLElement | null = null;
  private resetButton: HTMLElement | null = null;
  private onPan: (direction: 'up' | 'right' | 'down' | 'left') => void;
  private onReset: () => void;

  /**
   * Constructor
   */
  constructor(
    container: HTMLElement,
    onPan: (direction: 'up' | 'right' | 'down' | 'left') => void,
    onReset: () => void
  ) {
    this.container = container;
    this.onPan = onPan;
    this.onReset = onReset;

    this.init();
  }

  /**
   * Initialize the pan controls
   */
  private init(): void {
    // Create pan up button
    this.panUpButton = createButton(
      CSS_CLASSES.panUp,
      '↑',
      this.handlePanUp
    );
    
    // Create pan right button
    this.panRightButton = createButton(
      CSS_CLASSES.panRight,
      '→',
      this.handlePanRight
    );
    
    // Create pan down button
    this.panDownButton = createButton(
      CSS_CLASSES.panDown,
      '↓',
      this.handlePanDown
    );
    
    // Create pan left button
    this.panLeftButton = createButton(
      CSS_CLASSES.panLeft,
      '←',
      this.handlePanLeft
    );
    
    // Create reset button
    this.resetButton = createButton(
      CSS_CLASSES.reset,
      'R',
      this.handleReset
    );
    
    // Append to container
    this.container.appendChild(this.panUpButton);
    this.container.appendChild(this.panRightButton);
    this.container.appendChild(this.panDownButton);
    this.container.appendChild(this.panLeftButton);
    this.container.appendChild(this.resetButton);
  }

  /**
   * Handle pan up button click
   */
  private handlePanUp = (e: MouseEvent): void => {
    e.preventDefault();
    this.onPan('up');
  };

  /**
   * Handle pan right button click
   */
  private handlePanRight = (e: MouseEvent): void => {
    e.preventDefault();
    this.onPan('right');
  };

  /**
   * Handle pan down button click
   */
  private handlePanDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.onPan('down');
  };

  /**
   * Handle pan left button click
   */
  private handlePanLeft = (e: MouseEvent): void => {
    e.preventDefault();
    this.onPan('left');
  };

  /**
   * Handle reset button click
   */
  private handleReset = (e: MouseEvent): void => {
    e.preventDefault();
    this.onReset();
  };

  /**
   * Enable all pan buttons
   */
  public enablePan(): void {
    if (this.panUpButton) this.panUpButton.removeAttribute('disabled');
    if (this.panRightButton) this.panRightButton.removeAttribute('disabled');
    if (this.panDownButton) this.panDownButton.removeAttribute('disabled');
    if (this.panLeftButton) this.panLeftButton.removeAttribute('disabled');
  }

  /**
   * Disable all pan buttons
   */
  public disablePan(): void {
    if (this.panUpButton) this.panUpButton.setAttribute('disabled', 'disabled');
    if (this.panRightButton) this.panRightButton.setAttribute('disabled', 'disabled');
    if (this.panDownButton) this.panDownButton.setAttribute('disabled', 'disabled');
    if (this.panLeftButton) this.panLeftButton.setAttribute('disabled', 'disabled');
  }

  /**
   * Enable reset button
   */
  public enableReset(): void {
    if (this.resetButton) {
      this.resetButton.removeAttribute('disabled');
    }
  }

  /**
   * Disable reset button
   */
  public disableReset(): void {
    if (this.resetButton) {
      this.resetButton.setAttribute('disabled', 'disabled');
    }
  }
}
