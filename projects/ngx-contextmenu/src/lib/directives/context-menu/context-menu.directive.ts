import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuEventService } from '../../services/context-menu-event/context-menu-event.service';
import { ContextMenuStackService } from '../../services/context-menu-stack/context-menu-stack.service';

@Directive({
  selector: '[contextMenu]',
  exportAs: 'ngxContextMenu',
})
export class ContextMenuDirective<T> {
  /**
   * The value related to the context menu
   */
  @Input()
  public contextMenuValue!: T;

  /**
   * The component holding the menu item directive templates
   */
  @Input()
  public contextMenu!: ContextMenuComponent<T>;

  /**
   * The directive must have a tabindex for being accessible
   */
  @Input()
  @HostBinding('attr.tabindex')
  public tabindex: string | number = '0';

  /**
   * Accessibility
   *
   * @internal
   */
  @HostBinding('attr.aria-haspopup')
  public ariaHasPopup = 'true';

  constructor(
    private contextMenuEventService: ContextMenuEventService<T>,
    private elementRef: ElementRef<HTMLElement>,
    private contextMenuStackService: ContextMenuStackService<T>
  ) {}

  /**
   * Programmatically open the context menu
   */
  public open(event?: MouseEvent): void {
    if (!this.canOpen()) {
      return;
    }

    if (event instanceof MouseEvent) {
      this.onContextMenu(event);
      return;
    }

    const { x, y, height } =
      this.elementRef.nativeElement.getBoundingClientRect();

    this.contextMenuEventService.show({
      anchoredTo: 'position',
      x,
      y: y + height,
      contextMenu: this.contextMenu,
      value: this.contextMenuValue,
    });
  }

  /**
   * Programmatically close the context menu
   */
  public close(): void {
    this.contextMenuStackService.closeAll();
  }

  /**
   * @internal
   */
  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    if (!this.canOpen()) {
      return;
    }

    this.contextMenuEventService.show({
      anchoredTo: 'position',
      contextMenu: this.contextMenu,
      x: event.clientX,
      y: event.clientY,
      value: this.contextMenuValue,
    });
    event.preventDefault();
    event.stopPropagation();
  }

  private canOpen(): boolean {
    return this.contextMenu && !this.contextMenu.disabled;
  }
}
