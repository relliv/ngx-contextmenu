import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { ContextMenuContentComponent } from '../context-menu-content/context-menu-content.component';
import { ContextMenuComponent } from './context-menu.component';

export interface IContextMenuBaseEvent<T> {}

export interface IContextMenuClickEvent<T> {
  anchoredTo: 'position';
  x: number;
  y: number;
  contextMenu: ContextMenuComponent<T>;
  parentContextMenu?: ContextMenuContentComponent<T>;
  item?: T;
}

export interface IContextMenuOpenKeyboardEvent<T> {
  anchoredTo: 'element';
  anchorElement: Element | EventTarget;
  contextMenu: ContextMenuComponent<T>;
  parentContextMenu: ContextMenuContentComponent<T>;
  item?: T;
}

export type IContextMenuOpenEvent<T> =
  | IContextMenuClickEvent<T>
  | IContextMenuOpenKeyboardEvent<T>;

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
