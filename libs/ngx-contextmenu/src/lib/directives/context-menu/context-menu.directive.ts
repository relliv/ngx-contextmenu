import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import type { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuOverlaysService } from '../../services/context-menu-overlays/context-menu-overlays.service';

@Directive({
  selector: '[contextMenu]',
  exportAs: 'ngxContextMenu',
  host: {
    role: 'button',
    'attr.aria-haspopup': 'menu',
  },
  standalone: false,
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
  public contextMenu?: ContextMenuComponent<T>;

  /**
   * The directive must have a tabindex for being accessible
   */
  @Input()
  @HostBinding('attr.tabindex')
  public tabindex: string | number = '0';

  /**
   * Return true if the context menu is opened, false otherwise
   */
  @HostBinding('attr.aria-expanded')
  public get isOpen(): boolean {
    return this.contextMenu?.isOpen ?? false;
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private contextMenuOverlaysService: ContextMenuOverlaysService
  ) {}

  /**
   * @internal
   */
  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    if (!this.canOpen()) {
      return;
    }

    this.closeAll();

    this.contextMenu?.show({
      anchoredTo: 'position',
      x: event.clientX,
      y: event.clientY,
      value: this.contextMenuValue,
    });

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * @internal
   */
  @HostListener('window:contextmenu')
  @HostListener('window:keydown.Escape')
  public onKeyArrowEscape(): void {
    this.close();
  }

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

    this.contextMenu?.show({
      anchoredTo: 'position',
      x,
      y: y + height,
      value: this.contextMenuValue,
    });
  }

  /**
   * Programmatically close the context menu
   */
  public close(): void {
    this.contextMenu?.hide();
  }

  private closeAll(): void {
    this.contextMenuOverlaysService.closeAll();
  }

  private canOpen(): boolean {
    return (this.contextMenu && !this.contextMenu.disabled) ?? false;
  }
}
