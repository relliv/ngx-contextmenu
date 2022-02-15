import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IContextMenuOptions } from '../../context-menu.options';
import { CONTEXT_MENU_OPTIONS } from '../../context-menu.tokens';
import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { evaluateIfFunction } from '../../helper/evaluate';
import { ContextMenuStackService } from '../../services/context-menu-stack/context-menu-stack.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ContextMenuContentComponent } from '../context-menu-content/context-menu-content.component';
import {
  getPositionsToAnchorElement,
  getPositionsToXY,
} from './context-menu.component.helpers';
import {
  CloseContextMenuEvent,
  IContextMenuContext,
  IContextMenuOpenEvent,
} from './context-menu.component.interface';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'context-menu',
  styleUrls: ['./context-menu.component.scss'],
  template: '',
})
export class ContextMenuComponent implements OnDestroy {
  /**
   * A CSS class to add to the context menu, ideal for theming and custom styling
   */
  @Input()
  public menuClass = '';

  /**
   * Focus on the menu when opened
   */
  @Input()
  public autoFocus = this.options?.autoFocus || false;

  /**
   * Disabled the whole context menu
   */
  @Input()
  public disabled = false;

  /**
   * Whether the menu is oriented to the right (default: `ltr`) or to the right (`rtl`)
   */
  @Input()
  public dir: 'ltr' | 'rtl' | undefined;

  /**
   * Emit when the menu is opened
   */
  @Output()
  public open: EventEmitter<IContextMenuOpenEvent> = new EventEmitter();

  /**
   * Emit when the menu is closed
   */
  @Output()
  public close: EventEmitter<CloseContextMenuEvent> = new EventEmitter();

  /**
   * The menu item directives defined inside the component
   */
  @ContentChildren(ContextMenuItemDirective)
  public menuItems!: QueryList<ContextMenuItemDirective>;

  /**
   * @internal
   */
  public visibleMenuItems: ContextMenuItemDirective[] = [];
  /**
   * @internal
   */
  public item: any;

  private subscription: Subscription = new Subscription();

  constructor(
    private overlay: Overlay,
    private scrollStrategy: ScrollStrategyOptions,
    private contextMenuStack: ContextMenuStackService,
    private contextMenuService: ContextMenuService,
    @Optional()
    @Inject(CONTEXT_MENU_OPTIONS)
    private options: IContextMenuOptions
  ) {}

  /**
   * @internal
   */
  public ngOnInit(): void {
    const subscription = this.contextMenuService.show.subscribe((menuEvent) => {
      this.onMenuEvent(menuEvent);
    });

    this.subscription.add(subscription);
  }

  /**
   * @internal
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Open context menu
   */
  public openContextMenu(context: IContextMenuContext) {
    let positionStrategy: FlexibleConnectedPositionStrategy;

    if (context.anchoredTo === 'position') {
      positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo({
          x: context.x,
          y: context.y,
        })
        .withPositions(getPositionsToXY(context.dir));
      this.closeAllContextMenus({ eventType: 'cancel' });
    } else {
      const { anchorElement, parentContextMenu } = context;
      positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(new ElementRef(anchorElement))
        .withPositions(getPositionsToAnchorElement(parentContextMenu.dir));
      this.contextMenuStack.destroySubMenus(parentContextMenu);
    }

    const overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'ngx-contextmenu',
      scrollStrategy: this.scrollStrategy.close(),
    });
    this.attachContextMenu(overlayRef, context);
  }

  private onMenuEvent(event: IContextMenuOpenEvent): void {
    if (this.disabled) {
      return;
    }

    const { contextMenu, item } = event;

    if (contextMenu && contextMenu !== this) {
      return;
    }

    this.item = item;
    this.setVisibleMenuItems();

    this.openContextMenu({
      ...event,
      menuDirectives: this.visibleMenuItems,
      menuClass: this.menuClass,
      dir: this.dir,
    });

    this.open.next(event);
  }

  private attachContextMenu(
    overlayRef: OverlayRef,
    context: IContextMenuContext
  ): void {
    const { item, menuDirectives, menuClass, dir } = context;
    const contextMenuContentRef = overlayRef.attach(
      new ComponentPortal(ContextMenuContentComponent)
    );
    const { instance: contextMenuContentComponent } = contextMenuContentRef;

    contextMenuContentComponent.item = item;
    contextMenuContentComponent.menuDirectives = menuDirectives;
    contextMenuContentComponent.overlayRef = overlayRef;
    contextMenuContentComponent.isLeaf = true;
    contextMenuContentComponent.menuClass =
      menuClass || context?.parentContextMenu?.menuClass || '';
    contextMenuContentComponent.dir = dir || context?.parentContextMenu?.dir;
    contextMenuContentRef.changeDetectorRef.detectChanges;

    this.contextMenuStack.push({
      overlayRef,
      contextMenuComponent: contextMenuContentComponent,
    });

    const subscriptions: Subscription = new Subscription();
    subscriptions.add(
      contextMenuContentComponent.execute.subscribe((executeEvent) =>
        this.closeAllContextMenus({ eventType: 'execute', ...executeEvent })
      )
    );
    subscriptions.add(
      contextMenuContentComponent.closeAllMenus.subscribe((closeAllEvent) =>
        this.closeAllContextMenus({ eventType: 'cancel', ...closeAllEvent })
      )
    );
    subscriptions.add(
      contextMenuContentComponent.closeLeafMenu.subscribe(
        (closeLeafMenuEvent) =>
          this.destroyLeafMenu(!!closeLeafMenuEvent.excludeRootMenu)
      )
    );
    subscriptions.add(
      contextMenuContentComponent.openSubMenu.subscribe(
        (subMenuEvent: IContextMenuOpenEvent) => {
          this.contextMenuStack.destroySubMenus(contextMenuContentComponent);
          if (!subMenuEvent.contextMenu) {
            contextMenuContentComponent.isLeaf = true;
            return;
          }
          contextMenuContentComponent.isLeaf = false;
          this.contextMenuService.display(subMenuEvent);
        }
      )
    );
    contextMenuContentRef.onDestroy(() => {
      menuDirectives.forEach((menuItem) => (menuItem.isActive = false));
      subscriptions.unsubscribe();
    });
    contextMenuContentRef.changeDetectorRef.detectChanges();
  }

  private closeAllContextMenus(closeEvent: CloseContextMenuEvent): void {
    this.close.next(closeEvent);
    this.contextMenuStack.closeAll();
  }

  private destroyLeafMenu(excludeRootMenu: boolean): void {
    const hasDestroyedRoot =
      this.contextMenuStack.closeLeafMenu(excludeRootMenu);

    if (hasDestroyedRoot) {
      this.close.next({ eventType: 'cancel' });
    }
  }

  private isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean {
    return evaluateIfFunction(menuItem.visible, this.item);
  }

  private setVisibleMenuItems(): void {
    this.visibleMenuItems = this.menuItems.filter((menuItem) =>
      this.isMenuItemVisible(menuItem)
    );
  }
}
