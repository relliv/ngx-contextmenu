import { OverlayRef } from '@angular/cdk/overlay';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuOverlaysService {
  /**
   * Emits when all context menus are closed
   */
  public allClosed = new EventEmitter<void>();

  private stack: OverlayRef[] = [];

  /**
   * Add an item to the stack
   */
  public push(value: OverlayRef) {
    this.stack.push(value);
  }

  /**
   * Clear the whole stack
   */
  public closeAll(): void {
    this.stack.forEach((item) => this.dispose(item));
    this.stack = [];
    this.allClosed.emit();
  }

  public isEmpty(): boolean {
    return this.stack.length === 0;
  }

  private dispose(overlayRef: OverlayRef) {
    overlayRef.detach();
    overlayRef.dispose();
  }
}
