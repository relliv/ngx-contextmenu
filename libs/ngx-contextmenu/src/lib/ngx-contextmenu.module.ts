import {
  FullscreenOverlayContainer,
  OverlayContainer,
  OverlayModule,
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextMenuContentComponent } from './components/context-menu-content/context-menu-content.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ContextMenuContentItemDirective } from './directives/context-menu-content-item/context-menu-content-item.directive';
import { ContextMenuItemDirective } from './directives/context-menu-item/context-menu-item.directive';
import { ContextMenuDirective } from './directives/context-menu/context-menu.directive';

@NgModule({
  declarations: [
    ContextMenuComponent,
    ContextMenuContentComponent,
    ContextMenuContentItemDirective,
    ContextMenuDirective,
    ContextMenuItemDirective,
  ],
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],
  exports: [
    ContextMenuDirective,
    ContextMenuComponent,
    ContextMenuItemDirective,
  ],
  imports: [CommonModule, OverlayModule],
})
export class ContextMenuModule {}
