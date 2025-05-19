/**
 * Tests for the MapControls class
 */

import { MapControls } from '../src/core/MapControls';
import { Position, Size } from '../src/core/types';

// Mock DOM elements and functions
class MockHTMLElement {
  style: any = {};
  className: string = '';
  children: MockHTMLElement[] = [];
  
  appendChild(child: MockHTMLElement): void {
    this.children.push(child);
  }
  
  addEventListener(event: string, handler: any): void {}
  
  removeEventListener(event: string, handler: any): void {}
  
  getBoundingClientRect(): any {
    return { width: 800, height: 600 };
  }
  
  setAttribute(name: string, value: string): void {}
  
  removeAttribute(name: string): void {}
  
  contains(element: MockHTMLElement): boolean {
    return this.children.includes(element);
  }
}

// Mock document
(global as any).document = {
  createElement: (tag: string) => new MockHTMLElement(),
  head: new MockHTMLElement(),
  getElementById: (id: string) => null,
  createTextNode: (text: string) => ({ text })
};

// Mock window
(global as any).window = {
  getComputedStyle: () => ({
    width: '800px',
    height: '600px'
  })
};

// Mock Image
(global as any).Image = class {
  onload: () => void = () => {};
  onerror: () => void = () => {};
  src: string = '';
  naturalWidth: number = 1000;
  naturalHeight: number = 800;
  
  constructor() {
    setTimeout(() => this.onload(), 0);
  }
};

describe('MapControls', () => {
  let container: MockHTMLElement;
  let mapControls: MapControls;
  
  beforeEach(() => {
    container = new MockHTMLElement();
    mapControls = new MapControls({
      container: container as unknown as HTMLElement,
      mapSrc: 'test-map.jpg'
    });
  });
  
  test('should initialize with default options', () => {
    expect(mapControls).toBeDefined();
  });
  
  test('should handle zoom in', () => {
    const initialState = mapControls.getState();
    mapControls.zoomIn();
    const newState = mapControls.getState();
    
    expect(newState.zoom).toBeGreaterThan(initialState.zoom);
  });
  
  test('should handle zoom out', () => {
    // First zoom in to have room to zoom out
    mapControls.zoomIn(0.5);
    const initialState = mapControls.getState();
    
    mapControls.zoomOut();
    const newState = mapControls.getState();
    
    expect(newState.zoom).toBeLessThan(initialState.zoom);
  });
  
  test('should handle pan', () => {
    const initialState = mapControls.getState();
    mapControls.panTo(100, 100);
    const newState = mapControls.getState();
    
    expect(newState.position).not.toEqual(initialState.position);
  });
  
  test('should handle reset', () => {
    // First modify the state
    mapControls.zoomIn();
    mapControls.panTo(100, 100);
    
    // Then reset
    mapControls.reset();
    const state = mapControls.getState();
    
    expect(state.zoom).toBe(1); // Default initial zoom
  });
  
  test('should add event listeners', () => {
    let eventFired = false;
    
    mapControls.on('zoom', () => {
      eventFired = true;
    });
    
    mapControls.zoomIn();
    
    expect(eventFired).toBe(true);
  });
  
  test('should remove event listeners', () => {
    let eventCount = 0;
    
    const handler = () => {
      eventCount++;
    };
    
    mapControls.on('zoom', handler);
    mapControls.zoomIn(); // Count: 1
    
    mapControls.off('zoom', handler);
    mapControls.zoomIn(); // Should not increment
    
    expect(eventCount).toBe(1);
  });
  
  test('should clean up resources on destroy', () => {
    mapControls.destroy();
    
    // After destroy, operations should not affect the state
    const initialState = JSON.stringify(mapControls.getState());
    mapControls.zoomIn();
    const newState = JSON.stringify(mapControls.getState());
    
    expect(newState).toBe(initialState);
  });
});
