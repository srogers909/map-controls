/**
 * DOM utility functions for the Map Controls module
 */

import { CSS_CLASSES, DEFAULT_STYLES } from '../core/constants';

/**
 * Create an element with the specified attributes and properties
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  children: (string | Node)[] = []
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Append children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Add CSS styles to the document
 */
export function addStyles(styles: string): void {
  // Check if styles already exist
  const existingStyles = document.getElementById('map-controls-styles');
  if (existingStyles) {
    return;
  }
  
  // Create style element
  const styleElement = createElement('style', {
    id: 'map-controls-styles',
    type: 'text/css'
  }, [styles]);
  
  // Append to head
  document.head.appendChild(styleElement);
}

/**
 * Create the container element
 */
export function createContainer(originalContainer: HTMLElement): HTMLElement {
  // Create container element
  const container = createElement('div', {
    class: CSS_CLASSES.container
  });
  
  // Copy dimensions from original container
  const computedStyle = window.getComputedStyle(originalContainer);
  container.style.width = computedStyle.width;
  container.style.height = computedStyle.height;
  
  // Clear and append to original container
  originalContainer.innerHTML = '';
  originalContainer.appendChild(container);
  
  return container;
}

/**
 * Create the map element
 */
export function createMapElement(): HTMLElement {
  return createElement('div', {
    class: CSS_CLASSES.map
  });
}

/**
 * Create the controls container
 */
export function createControlsContainer(position: string): HTMLElement {
  const positionClass = CSS_CLASSES[position as keyof typeof CSS_CLASSES] || CSS_CLASSES.bottomRight;
  
  return createElement('div', {
    class: `${CSS_CLASSES.controls} ${positionClass}`
  });
}

/**
 * Create a button element
 */
export function createButton(
  className: string,
  label: string,
  onClick: (event: MouseEvent) => void
): HTMLElement {
  const button = createElement('button', {
    class: `${CSS_CLASSES.button} ${className}`,
    type: 'button',
    'aria-label': label
  }, [label]);
  
  button.addEventListener('click', onClick);
  
  return button;
}

/**
 * Get the size of an element
 */
export function getElementSize(element: HTMLElement): { width: number; height: number } {
  const { width, height } = element.getBoundingClientRect();
  return { width, height };
}

/**
 * Apply transform to an element
 */
export function applyTransform(
  element: HTMLElement,
  x: number,
  y: number,
  scale: number
): void {
  element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

/**
 * Load an image and get its natural dimensions
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    img.src = src;
  });
}
