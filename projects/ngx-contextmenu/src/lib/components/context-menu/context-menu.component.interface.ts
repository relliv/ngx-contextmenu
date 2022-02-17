import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { ContextMenuContentComponent } from '../context-menu-content/context-menu-content.component';
import { ContextMenuComponent } from './context-menu.component';

export interface IContextMenuBaseEvent<T> {
  anchoredTo: 'position' | 'element';
  /**
   * ContextMenuComponent instance to display
   */
  contextMenu: ContextMenuComponent<T>;
  /**
   * Optional associated data to the context menu, will be emitted when a menu item is selected
   */
  item?: T;
}

export interface IContextMenuAnchoredToPositionEvent<T>
  extends IContextMenuBaseEvent<T> {
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

export interface IContextMenuAnchoredToElementEvent<T>
  extends IContextMenuBaseEvent<T> {
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

export type IContextMenuOpenEvent<T> =
  | IContextMenuAnchoredToPositionEvent<T>
  | IContextMenuAnchoredToElementEvent<T>;

export type IContextMenuContext<T> = IContextMenuOpenEvent<T> & {
  menuDirectives: ContextMenuItemDirective<T>[];
  menuClass: string;
  dir: 'ltr' | 'rtl' | undefined;
};
export interface CloseLeafMenuEvent {
  excludeRootMenu?: boolean;
  event?: MouseEvent | KeyboardEvent;
}

export interface CancelContextMenuEvent {
  eventType: 'cancel';
}
export interface ExecuteContextMenuEvent<T extends Object = any> {
  eventType: 'execute';
  item?: T;
  menuDirective: ContextMenuItemDirective<T>;
}
export type CloseContextMenuEvent<T extends Object = any> =
  | ExecuteContextMenuEvent<T>
  | CancelContextMenuEvent;
