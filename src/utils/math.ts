/**
 * Math utility functions for the Map Controls module
 */

import { Position, Size, MapState } from '../core/types';

/**
 * Clamp a number between a minimum and maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate the boundaries for panning based on the current state
 * Returns the minimum and maximum x and y coordinates
 */
export function calculateBoundaries(state: MapState): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const { zoom, mapSize, containerSize } = state;
  
  // Calculate the scaled map dimensions
  const scaledWidth = mapSize.width * zoom;
  const scaledHeight = mapSize.height * zoom;
  
  // Calculate the minimum and maximum x and y coordinates
  // For X: If the map is wider than the container, constrain it so both edges can be seen
  // If the map is narrower than the container, center it and don't allow panning
  let minX, maxX;
  if (scaledWidth > containerSize.width) {
    // Map is wider than container - allow panning to see both edges
    minX = containerSize.width - scaledWidth; // Right edge
    maxX = 0; // Left edge
  } else {
    // Map is narrower than container - center it horizontally
    const centerX = (containerSize.width - scaledWidth) / 2;
    minX = centerX;
    maxX = centerX;
  }
  
  // For Y: Same logic as X
  let minY, maxY;
  if (scaledHeight > containerSize.height) {
    // Map is taller than container - allow panning to see both edges
    minY = containerSize.height - scaledHeight; // Bottom edge
    maxY = 0; // Top edge
  } else {
    // Map is shorter than container - center it vertically
    const centerY = (containerSize.height - scaledHeight) / 2;
    minY = centerY;
    maxY = centerY;
  }
  
  return { minX, maxX, minY, maxY };
}

/**
 * Constrain the position within the boundaries
 */
export function constrainPosition(
  position: Position,
  boundaries: { minX: number; maxX: number; minY: number; maxY: number }
): Position {
  const { minX, maxX, minY, maxY } = boundaries;
  
  return {
    x: clamp(position.x, minX, maxX),
    y: clamp(position.y, minY, maxY)
  };
}

/**
 * Calculate the position after zooming to keep the center point
 */
export function calculateZoomPosition(
  currentState: MapState,
  newZoom: number,
  zoomCenter?: Position
): Position {
  const { position, zoom, containerSize } = currentState;
  
  // If no zoom center is provided, use the center of the container
  const center = zoomCenter || {
    x: containerSize.width / 2,
    y: containerSize.height / 2
  };
  
  // Calculate how much the position needs to change to maintain the center point
  const zoomFactor = newZoom / zoom;
  
  // Calculate the new position
  const newPosition = {
    x: center.x - (center.x - position.x) * zoomFactor,
    y: center.y - (center.y - position.y) * zoomFactor
  };
  
  return newPosition;
}

/**
 * Calculate the distance between two points
 */
export function calculateDistance(point1: Position, point2: Position): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the midpoint between two points
 */
export function calculateMidpoint(point1: Position, point2: Position): Position {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}
