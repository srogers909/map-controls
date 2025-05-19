/**
 * Canvas Renderer for the Map Controls module
 */

import { Renderer, MapState, Size } from '../core/types';
import { loadImage } from '../utils/dom';
import { applyTransform } from '../utils/dom';
import { CSS_CLASSES } from '../core/constants';

/**
 * Renders the map using HTML and CSS transforms
 */
export class CanvasRenderer implements Renderer {
  private container: HTMLElement | null = null;
  private mapElement: HTMLElement | null = null;
  private mapImage: HTMLImageElement | null = null;
  private mapSize: Size = { width: 0, height: 0 };

  /**
   * Initialize the renderer
   */
  public async init(container: HTMLElement, mapSrc: string): Promise<void> {
    this.container = container;
    
    try {
      // Load the map image
      this.mapImage = await loadImage(mapSrc);
      
      // Create map element
      this.mapElement = document.createElement('div');
      this.mapElement.className = CSS_CLASSES.map;
      
      // Set map size
      this.mapSize = {
        width: this.mapImage.naturalWidth,
        height: this.mapImage.naturalHeight
      };
      
      // Set background image
      this.mapElement.style.width = `${this.mapSize.width}px`;
      this.mapElement.style.height = `${this.mapSize.height}px`;
      this.mapElement.style.backgroundImage = `url(${mapSrc})`;
      this.mapElement.style.backgroundSize = 'contain';
      this.mapElement.style.backgroundRepeat = 'no-repeat';
      
      // Append to container
      this.container.appendChild(this.mapElement);
    } catch (error) {
      console.error('Failed to initialize renderer:', error);
      throw error;
    }
  }

  /**
   * Render the map with current state
   */
  public render(state: MapState): void {
    if (!this.mapElement) return;
    
    const { position, zoom } = state;
    
    // Apply transform
    applyTransform(this.mapElement, position.x, position.y, zoom);
  }

  /**
   * Get the map element
   */
  public getMapElement(): HTMLElement | null {
    return this.mapElement;
  }

  /**
   * Get the map size
   */
  public getMapSize(): Size {
    return this.mapSize;
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.mapElement && this.container) {
      this.container.removeChild(this.mapElement);
    }
    
    this.container = null;
    this.mapElement = null;
    this.mapImage = null;
  }

  /**
   * Change the map source
   */
  public async changeMapSource(mapSrc: string): Promise<void> {
    if (!this.mapElement || !this.container) {
      throw new Error('Renderer not initialized');
    }
    
    try {
      // Load the new map image
      this.mapImage = await loadImage(mapSrc);
      
      // Update map size
      this.mapSize = {
        width: this.mapImage.naturalWidth,
        height: this.mapImage.naturalHeight
      };
      
      // Update map element
      this.mapElement.style.width = `${this.mapSize.width}px`;
      this.mapElement.style.height = `${this.mapSize.height}px`;
      this.mapElement.style.backgroundImage = `url(${mapSrc})`;
    } catch (error) {
      console.error('Failed to change map source:', error);
      throw error;
    }
  }
}
