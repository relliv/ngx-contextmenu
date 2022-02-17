import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
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
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IContextMenuOptions } from '../../context-menu.options';
import { CONTEXT_MENU_OPTIONS } from '../../context-menu.tokens';
import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { evaluateIfFunction } from '../../helper/evaluate';
import {
  CloseLeafMenuEvent,
  IContextMenuOpenEvent,
} from '../context-menu/context-menu.component.interface';

export interface ILinkConfig {
  click: (item: any, $event?: MouseEvent) => void;
  enabled?: (item: any) => boolean;
  html: (item: any) => string;
}

const ARROW_LEFT_KEYCODE = 37;
const ARROW_RIGHT_KEYCODE = 39;

/**
 * For testing purpose only
 */
export const TESTING_WRAPPER = {
  ActiveDescendantKeyManager: ActiveDescendantKeyManager,
};

@Component({
  selector: 'context-menu-content',
  templateUrl: './context-menu-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuContentComponent<T>
  implements OnInit, OnDestroy, AfterViewInit
{
  /**
   * The list of `ContextMenuItemDirective` that represent each menu items
   */
  @Input()
  public menuDirectives: ContextMenuItemDirective<T>[] = [];

  /**
   * The item on which the menu act
   */
  @Input()
  public item?: T;

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
  @Input()
  public menuClass: string = '';

  /**
   * The overlay ref associated to the instance
   */
  @Input()
  public overlayRef: OverlayRef | undefined;

  /**
   * Wether the instance is a leaf menu or not
   */
  @Input()
  public isLeaf = false;

  /**
   * Emit when a menu item is selected
   */
  @Output()
  public execute: EventEmitter<{
    event: MouseEvent | KeyboardEvent;
    item?: T;
    menuDirective: ContextMenuItemDirective<T>;
  }> = new EventEmitter();

  /**
   * Emit when a sub menu is opened
   */
  @Output()
  public openSubMenu: EventEmitter<IContextMenuOpenEvent<T>> =
    new EventEmitter();

  /**
   * Emit when a leaf menu is closed
   */
  @Output()
  public closeLeafMenu: EventEmitter<CloseLeafMenuEvent> = new EventEmitter();

  /**
   * Emit when all menus is closed
   */
  @Output()
  public closeAllMenus: EventEmitter<{
    event: MouseEvent;
  }> = new EventEmitter();

  /**
   * @internal
   */
  @ViewChild('menu', { static: true })
  public menuElementRef!: ElementRef;

  /**
   * @internal
   */
  @ViewChildren('li')
  public liElementRefs!: QueryList<ElementRef>;

  private autoFocus?: boolean = this.options?.autoFocus || false;
  private keyManager!: ActiveDescendantKeyManager<ContextMenuItemDirective<T>>;
  private subscription: Subscription = new Subscription();
  constructor(
    @Optional()
    @Inject(CONTEXT_MENU_OPTIONS)
    private options: IContextMenuOptions
  ) {}

  /**
   * @internal
   */
  public ngOnInit(): void {
    this.setupDirectives();
  }

  /**
   * @internal
   */
  public ngAfterViewInit() {
    if (this.autoFocus) {
      setTimeout(() => this.focus());
    }
    this.overlayRef?.updatePosition();
  }

  /**
   * @internal
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * @internal
   */
  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  public onKeyArrowDownOrUp(event: KeyboardEvent): void {
    if (!this.isLeaf) {
      return;
    }

    this.keyManager.onKeydown(event);
  }

  /**
   * @internal
   */
  @HostListener('window:keydown.ArrowRight', ['$event'])
  public onKeyArrowRight(event: KeyboardEvent): void {
    if (!this.isLeaf) {
      return;
    }

    if (this.dir === 'rtl') {
      this.closeActiveItemSubMenu(event);
      return;
    }

    this.openActiveItemSubMenu(event);
  }

  /**
   * @internal
   */
  @HostListener('window:keydown.ArrowLeft', ['$event'])
  public onKeyArrowLeft(event: KeyboardEvent): void {
    if (!this.isLeaf) {
      return;
    }

    if (this.dir === 'rtl') {
      this.openActiveItemSubMenu(event);
      return;
    }

    this.closeActiveItemSubMenu(event);
  }

  /**
   * @internal
   */
  @HostListener('window:keydown.Enter', ['$event'])
  @HostListener('window:keydown.Space', ['$event'])
  public onKeyEnterOrSpace(event: KeyboardEvent): void {
    if (!this.isLeaf) {
      return;
    }

    this.openActiveItemSubMenu(event);
  }

  /**
   * @internal
   */
  @HostListener('window:keydown.Escape', ['$event'])
  public onKeyArrowEscape(event: KeyboardEvent): void {
    if (!this.isLeaf) {
      return;
    }

    this.closeActiveItemSubMenu(event);
  }

  /**
   * @internal
   */
  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  public onClickOrRightClick(event: MouseEvent): void {
    if (event.type === 'click' && event.button === 2) {
      return;
    }
    this.closeAllMenus.emit({ event });
  }

  /**
   * @internal
   */
  public focus(): void {
    if (this.autoFocus) {
      this.menuElementRef.nativeElement.focus();
    }
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
  public isMenuItemEnabled(menuItem: ContextMenuItemDirective<T>): boolean {
    return evaluateIfFunction(menuItem.enabled, this.item);
  }

  /**
   * @internal
   */
  public isMenuItemVisible(menuItem: ContextMenuItemDirective<T>): boolean {
    return evaluateIfFunction(menuItem.visible, this.item);
  }

  /**
   * @internal
   */
  public isDisabled(link: ILinkConfig): boolean {
    return !!link.enabled && !link.enabled(this.item);
  }

  /**
   * @internal
   */
  public onOpenSubMenu(
    menuItem: ContextMenuItemDirective<T>,
    event: MouseEvent | KeyboardEvent
  ): void {
    if (this.keyManager.activeItemIndex === null || !menuItem.subMenu) {
      return;
    }

    const anchorElementRef =
      this.liElementRefs.toArray()[this.keyManager.activeItemIndex];
    const anchorElement = anchorElementRef && anchorElementRef.nativeElement;

    if (anchorElement && event instanceof KeyboardEvent) {
      this.openSubMenu.emit({
        anchoredTo: 'element',
        anchorElement,
        contextMenu: menuItem.subMenu,
        item: this.item,
        parentContextMenu: this,
      });
    } else if (event.target) {
      this.openSubMenu.emit({
        anchoredTo: 'element',
        anchorElement: event.target,
        contextMenu: menuItem.subMenu,
        item: this.item,
        parentContextMenu: this,
      });
    } else {
      this.openSubMenu.emit({
        anchoredTo: 'position',
        x: (event as MouseEvent).clientX,
        y: (event as MouseEvent).clientY,
        contextMenu: menuItem.subMenu,
        item: this.item,
        // parentContextMenu: this,
      });
    }
  }

  /**
   * @internal
   */
  public onMenuItemSelect(
    menuItem: ContextMenuItemDirective<T>,
    event: MouseEvent | KeyboardEvent
  ): void {
    event.preventDefault();
    event.stopPropagation();
    this.onOpenSubMenu(menuItem, event);
    if (!menuItem.subMenu) {
      menuItem.triggerExecute(event, this.item);
    }
  }

  private setupDirectives() {
    this.menuDirectives.forEach((menuDirective) => {
      menuDirective.item = this.item;
      this.subscription.add(
        menuDirective.execute.subscribe((event) =>
          this.execute.emit({ ...event, menuDirective })
        )
      );
    });
    const queryList = new QueryList<ContextMenuItemDirective<T>>();
    queryList.reset(this.menuDirectives);
    this.keyManager = new TESTING_WRAPPER.ActiveDescendantKeyManager<
      ContextMenuItemDirective<T>
    >(queryList).withWrap();
  }

  private openActiveItemSubMenu(event: KeyboardEvent) {
    if (this.keyManager.activeItemIndex === null) {
      return;
    }

    this.cancelEvent(event);

    if (this.keyManager.activeItem) {
      this.onOpenSubMenu(this.keyManager.activeItem, event);
    }
  }

  private closeActiveItemSubMenu(event: KeyboardEvent) {
    if (this.keyManager.activeItemIndex === null) {
      return;
    }

    this.cancelEvent(event);

    this.closeLeafMenu.emit({
      excludeRootMenu:
        this.dir === 'rtl'
          ? event.keyCode === ARROW_RIGHT_KEYCODE
          : event.keyCode === ARROW_LEFT_KEYCODE,
      event,
    });
  }

  private cancelEvent(event?: KeyboardEvent): void {
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
