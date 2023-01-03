/*
 * Public API Surface of @perfectmemory/ngx-contextmenu
 */

export { ContextMenuModule } from './lib/ngx-contextmenu.module';
/**
 * Components
 */
export { ContextMenuComponent } from './lib/components/context-menu/context-menu.component';
export {
  ContextMenuCloseEvent,
  ContextMenuOpenEvent,
} from './lib/components/context-menu/context-menu.component.interface';
/**
 * Directives
 */
export { ContextMenuItemDirective } from './lib/directives/context-menu-item/context-menu-item.directive';
export { ContextMenuDirective } from './lib/directives/context-menu/context-menu.directive';
/**
 * Services
 */
export { ContextMenuService } from './lib/services/context-menu/context-menu.service';
export { ContextMenuStackService } from './lib/services/context-menu/context-menu-stack.service';
