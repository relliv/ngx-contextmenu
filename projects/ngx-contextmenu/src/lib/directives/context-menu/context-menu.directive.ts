import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';

@Directive({
  selector: '[contextMenu]',
})
export class ContextMenuDirective<T> {
  /**
   * The item related to the context menu
   */
  @Input()
  public contextMenuItem?: T;

  /**
   * The component holding the menu item directive templates
   */
  @Input()
  public contextMenu?: ContextMenuComponent<T>;

  /**
   * The directive must have a tabindex for being accessible
   */
  @Input()
  @HostBinding('attr.tabindex')
  public tabindex = 0;

  /**
   * Optionally add a class to make it stylable
   */
  @Input()
  @HostBinding('class.ngx-context-menu-focusable')
  public contextMenuFocusableCSSClass = true;

  /**
   * Accessibility
   *
   * @internal
   */
  @HostBinding('attr.aria-haspopup')
  public ariaHasPopup = 'true';

  constructor(private contextMenuService: ContextMenuService<T>) {}

  /**
   * @internal
   */
  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    if (this.contextMenu && !this.contextMenu.disabled) {
      this.contextMenuService.display({
        anchoredTo: 'position',
        contextMenu: this.contextMenu,
        x: event.clientX,
        y: event.clientY,
        item: this.contextMenuItem,
      });
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
