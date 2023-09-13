import { FocusKeyManager } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ContextMenuContentItemDirective } from '../../directives/context-menu-content-item/context-menu-content-item.directive';
import type { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { evaluateIfFunction } from '../../helper/evaluate';
import { ContextMenuOverlaysService } from '../../services/context-menu-overlays/context-menu-overlays.service';
import type { ContextMenuComponent } from '../context-menu/context-menu.component';

/**
 * For testing purpose only
 */
export const TESTING_WRAPPER = {
  FocusKeyManager,
};

@Component({
  selector: 'context-menu-content',
  templateUrl: './context-menu-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    tabindex: '0',
    role: 'dialog',
    class: 'ngx-contextmenu',
  },
})
export class ContextMenuContentComponent<T>
  implements OnDestroy, AfterViewInit
{
  /**
   * The list of `IContextMenuItemDirective` that represent each menu items
   */
  @Input()
  public menuDirectives: ContextMenuItemDirective<T>[] = [];

  /**
   * The item on which the menu act
   */
  @Input()
  public value?: T;

  /**
   * The orientation of the component
   * @see https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/dir
   */
  @Input()
  @HostBinding('attr.dir')
  public dir: 'ltr' | 'rtl' | undefined;

  /**
   * The parent menu of the instance
   */
  @Input()
  public parentContextMenu!: ContextMenuContentComponent<T>;

  /**
   * A CSS class to apply a theme to the the menu
   */
  @HostBinding('class')
  @Input()
  public menuClass = '';

  /**
   * Emit when a menu item is selected
   */
  @Output()
  public execute = new EventEmitter<{
    event: MouseEvent | KeyboardEvent;
    value?: T;
    menuDirective: ContextMenuItemDirective<T>;
  }>();

  /**
   * Emit when all menus is closed
   */
  @Output()
  public close = new EventEmitter<void>();

  /**
   * @internal
   */
  @ViewChildren(ContextMenuContentItemDirective, {
    read: ContextMenuContentItemDirective,
  })
  public contextMenuContentItems!: QueryList<
    ContextMenuContentItemDirective<T>
  >;

  /**
   * Accessibility
   *
   * @internal
   */
  @HostBinding('attr.role')
  public role = 'menu';
  /**
   * Accessibility
   *
   * @internal
   */
  @HostBinding('aria-orientation')
  public ariaOrientation = 'vertical';

  private focusKeyManager!: FocusKeyManager<ContextMenuContentItemDirective<T>>;
  private subscription: Subscription = new Subscription();
  private activeElement?: HTMLElement | null;

  // TODO: should be private but issue in spec with NullInjectorError: No provider for ElementRef!
  constructor(
    public _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT)
    public document: Document,
    private contextMenuOverlaysService: ContextMenuOverlaysService
  ) {}

  /**
   * @internal
   */
  public ngAfterViewInit() {
    this.setupDirectives();
    this.activeElement = this.document.activeElement as HTMLElement | null;
    this._elementRef.nativeElement.focus();
  }

  /**
   * @internal
   */
  public ngOnDestroy() {
    this.activeElement?.focus();
    this.subscription.unsubscribe();
    this.focusKeyManager.destroy();
  }

  /**
   * @internal
   */
  @HostListener('keydown.ArrowDown', ['$event'])
  @HostListener('keydown.ArrowUp', ['$event'])
  public onKeyArrowDownOrUp(event: KeyboardEvent): void {
    this.focusKeyManager.onKeydown(event);
  }

  /**
   * @internal
   */
  @HostListener('keydown.ArrowRight', ['$event'])
  public onKeyArrowRight(event: KeyboardEvent): void {
    this.openCloseActiveItemSubMenu(this.dir !== 'rtl', event);
  }

  /**
   * @internal
   */
  @HostListener('keydown.ArrowLeft', ['$event'])
  public onKeyArrowLeft(event: KeyboardEvent): void {
    this.openCloseActiveItemSubMenu(this.dir === 'rtl', event);
  }

  /**
   * @internal
   */
  @HostListener('window:keydown.Enter', ['$event'])
  @HostListener('window:keydown.Space', ['$event'])
  public onKeyEnterOrSpace(event: KeyboardEvent): void {
    if (!this.focusKeyManager.activeItem) {
      return;
    }

    this.onMenuItemSelect(this.focusKeyManager.activeItem, event);
  }

  /**
   * @internal
   */
  @HostListener('document:click', ['$event'])
  public onClickOrRightClick(event: MouseEvent): void {
    if (event.type === 'click' && event.button === 2) {
      return;
    }

    if (this._elementRef.nativeElement.contains(event.target as Node)) {
      return;
    }

    this.contextMenuOverlaysService.closeAll();
  }

  /**
   * @internal
   */
  public hideSubMenus(): void {
    this.menuDirectives.forEach((menuDirective) => {
      menuDirective.subMenu?.hide();
    });
  }

  /**
   * @internal
   */
  public stopEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * @internal
   */
  public isMenuItemDisabled(menuItem: ContextMenuItemDirective<T>): boolean {
    return evaluateIfFunction(menuItem.disabled, this.value);
  }

  /**
   * @internal
   */
  public isMenuItemVisible(
    menuItem: ContextMenuContentItemDirective<T>
  ): boolean {
    return evaluateIfFunction(
      menuItem.contextMenuContentItem?.visible,
      this.value
    );
  }

  /**
   * @internal
   */
  public openSubMenu(
    subMenu: ContextMenuComponent<T> | undefined,
    event: MouseEvent | KeyboardEvent
  ): void {
    if (!subMenu) {
      return;
    }

    if (this.focusKeyManager.activeItemIndex === null || !subMenu) {
      return;
    }

    const anchorContextMenuContentItem =
      this.contextMenuContentItems.toArray()[
        this.focusKeyManager.activeItemIndex
      ];
    const anchorElement =
      anchorContextMenuContentItem &&
      anchorContextMenuContentItem.nativeElement;

    if (anchorElement && event instanceof KeyboardEvent) {
      subMenu.show({
        anchoredTo: 'element',
        anchorElement,
        value: this.value,
        parentContextMenu: this,
      });
    } else if (event.currentTarget) {
      subMenu.show({
        anchoredTo: 'element',
        anchorElement: event.currentTarget,
        value: this.value,
        parentContextMenu: this,
      });
    } else {
      subMenu.show({
        anchoredTo: 'position',
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY,
        value: this.value,
      });
    }
  }

  /**
   * @internal
   */
  public onMenuItemSelect(
    menuContentItem: ContextMenuContentItemDirective<T>,
    event: MouseEvent | KeyboardEvent
  ): void {
    this.cancelEvent(event);
    this.openSubMenu(menuContentItem.contextMenuContentItem?.subMenu, event);
    if (!menuContentItem.contextMenuContentItem?.subMenu) {
      this.triggerExecute(menuContentItem, event);
    }
  }

  private triggerExecute(
    menuItem: ContextMenuContentItemDirective<T>,
    event: MouseEvent | KeyboardEvent
  ): void {
    menuItem.contextMenuContentItem?.triggerExecute(event, this.value);
  }

  private setupDirectives() {
    this.menuDirectives.forEach((menuDirective) => {
      menuDirective.value = this.value;
      this.subscription.add(
        menuDirective.execute.subscribe((event) => {
          this.execute.emit({ ...event, menuDirective });
        })
      );
    });
    this.focusKeyManager = new TESTING_WRAPPER.FocusKeyManager<
      ContextMenuContentItemDirective<T>
    >(this.contextMenuContentItems).withWrap();
  }

  private openCloseActiveItemSubMenu(open: boolean, event: KeyboardEvent) {
    if (open) {
      this.openActiveItemSubMenu(event);
      return;
    }

    this.closeActiveItemSubMenu(event);
  }

  private openActiveItemSubMenu(event: KeyboardEvent) {
    if (this.focusKeyManager.activeItemIndex === null) {
      return;
    }

    this.cancelEvent(event);

    if (this.focusKeyManager.activeItem) {
      this.openSubMenu(
        this.focusKeyManager.activeItem?.contextMenuContentItem?.subMenu,
        event
      );
    }
  }

  private closeActiveItemSubMenu(event: KeyboardEvent) {
    if (this.focusKeyManager.activeItemIndex === null) {
      return;
    }

    this.close.emit();
    this.cancelEvent(event);
  }

  private cancelEvent(event?: MouseEvent | KeyboardEvent): void {
    if (!event || !event.target) {
      return;
    }

    const target = event.target as HTMLElement;
    if (
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
      target.isContentEditable
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }
}
