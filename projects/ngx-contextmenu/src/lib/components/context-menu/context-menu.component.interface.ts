import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { ContextMenuContentComponent } from '../context-menu-content/context-menu-content.component';
import { ContextMenuComponent } from './context-menu.component';

export interface IContextMenuClickEvent {
  anchoredTo: 'position';
  x: number;
  y: number;
  contextMenu: ContextMenuComponent;
  parentContextMenu?: ContextMenuContentComponent;
  item: any;
}

export interface IContextMenuOpenKeyboardEvent {
  anchoredTo: 'element';
  anchorElement: Element | EventTarget;
  contextMenu?: ContextMenuComponent;
  parentContextMenu: ContextMenuContentComponent;
  item: any;
}

export type IContextMenuOpenEvent =
  | IContextMenuClickEvent
  | IContextMenuOpenKeyboardEvent;

export type IContextMenuContext = IContextMenuOpenEvent & {
  menuDirectives: ContextMenuItemDirective[];
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
export interface ExecuteContextMenuEvent {
  eventType: 'execute';
  item: any;
  menuDirective: ContextMenuItemDirective;
}
export type CloseContextMenuEvent =
  | ExecuteContextMenuEvent
  | CancelContextMenuEvent;
