import { Injectable } from '@angular/core';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuOverlaysService } from '../context-menu-overlays/context-menu-overlays.service';

export interface ContextMenuOpenAtPositionOptions<T> {
  /**
   * Optional associated data to the context menu, will be emitted when a menu item is selected
   */
  value?: T;
  /**
   * The horizontal position of the menu
   */
  x: number;
  /**
   * The vertical position of the menu
   */
  y: number;
}

/**
 * Programmatically open a ContextMenuComponent to a X/Y position
 */
@Injectable({
  providedIn: 'root',
})
export class ContextMenuService<T> {
  constructor(private contextMenuOverlaysService: ContextMenuOverlaysService) {}
  /**
   * Show the given `ContextMenuComponent` at a specified X/Y position
   */
  public show(
    contextMenu: ContextMenuComponent<T>,
    options: ContextMenuOpenAtPositionOptions<T> = { x: 0, y: 0 }
  ) {
    contextMenu.show({
      anchoredTo: 'position',
      value: options.value,
      x: options.x,
      y: options.y,
    });
  }

  /**
   * Close all open `ContextMenuComponent`
   */
  public closeAll(): void {
    this.contextMenuOverlaysService.closeAll();
  }

  /**
   * Return true if any `ContextMenuComponent` is open
   */
  public hasOpenMenu(): boolean {
    return !this.contextMenuOverlaysService.isEmpty();
  }
}
