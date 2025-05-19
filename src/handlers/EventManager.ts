/**
 * Event Manager for the Map Controls module
 */

import { EventType, EventHandler, EventListener } from '../core/types';

/**
 * Manages event listeners and dispatching
 */
export class EventManager {
  private listeners: EventListener[] = [];

  /**
   * Add an event listener
   */
  public on(type: EventType, handler: EventHandler): void {
    this.listeners.push({ type, handler });
  }

  /**
   * Remove an event listener
   */
  public off(type: EventType, handler: EventHandler): void {
    this.listeners = this.listeners.filter(
      listener => !(listener.type === type && listener.handler === handler)
    );
  }

  /**
   * Dispatch an event
   */
  public dispatch(type: EventType, ...args: any[]): void {
    this.listeners
      .filter(listener => listener.type === type)
      .forEach(listener => {
        try {
          listener.handler(...args);
        } catch (error) {
          console.error(`Error in ${type} event handler:`, error);
        }
      });
  }

  /**
   * Remove all event listeners
   */
  public removeAllListeners(): void {
    this.listeners = [];
  }

  /**
   * Get all listeners for a specific event type
   */
  public getListeners(type: EventType): EventListener[] {
    return this.listeners.filter(listener => listener.type === type);
  }
}
