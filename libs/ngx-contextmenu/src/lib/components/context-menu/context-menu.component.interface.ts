import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { ContextMenuContentComponent } from '../context-menu-content/context-menu-content.component';

export interface ContextMenuBaseEvent<T> {
  anchoredTo: 'position' | 'element';
  /**
   * Optional associated data to the context menu, will be emitted when a menu item is selected
   */
  value?: T;
}

export interface ContextMenuAnchoredToPositionEvent<T>
  extends ContextMenuBaseEvent<T> {
  /**
   * Open the menu to an x/y position
   */
  anchoredTo: 'position';
  /**
   * The horizontal position of the menu
   */
  x: number;
  /**
   * The vertical position of the menu
   */
  y: number;
}

export interface ContextMenuAnchoredToElementEvent<T>
  extends ContextMenuBaseEvent<T> {
  /**
   * Open the menu anchored to a DOM element
   */
  anchoredTo: 'element';
  /**
   * The anchor element to display the menu next to
   */
  anchorElement: Element | EventTarget;
  /**
   * The parent context menu from which this menu will be displayed
   */
  parentContextMenu: ContextMenuContentComponent<T>;
}

export type ContextMenuOpenEvent<T> =
  | ContextMenuAnchoredToPositionEvent<T>
  | ContextMenuAnchoredToElementEvent<T>;

export type IContextMenuContext<T> = ContextMenuOpenEvent<T> & {
  menuItemDirectives: ContextMenuItemDirective<T>[];
  menuClass: string;
  dir: 'ltr' | 'rtl' | undefined;
};
