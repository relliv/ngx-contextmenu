import {
  CloseScrollStrategy,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayModule,
  OverlayRef,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { ComponentRef, ElementRef, QueryList } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { ContextMenuOverlaysService } from '../../services/context-menu-overlays/context-menu-overlays.service';
import { ContextMenuContentComponent } from '../context-menu-content/context-menu-content.component';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuOpenEvent } from './context-menu.component.interface';

describe('Component: ContextMenuComponent', () => {
  let component: ContextMenuComponent<unknown>;
  let fixture: ComponentFixture<ContextMenuComponent<unknown>>;
  let scrollStrategyClose: jasmine.Spy<jasmine.Func>;
  let overlayPosition: jasmine.Spy<jasmine.Func>;
  let overlayFlexibleConnectedTo: jasmine.Spy<jasmine.Func>;
  let overlayWithPositions: jasmine.Spy<jasmine.Func>;
  let overlayCreate: jasmine.Spy<jasmine.Func>;
  let overlayRefAttach: jasmine.Spy<jasmine.Func>;
  let overlayRefDetach: jasmine.Spy<jasmine.Func>;
  let overlayRefDispose: jasmine.Spy<jasmine.Func>;
  let positionStrategy: FlexibleConnectedPositionStrategy;
  let overlayRef: OverlayRef;
  let contextMenuContentRef: ComponentRef<ContextMenuContentComponent<unknown>>;
  let closeScrollStrategy: CloseScrollStrategy;
  let contextMenuOverlaysService: ContextMenuOverlaysService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule],
      declarations: [ContextMenuComponent],
    }).compileComponents();
    contextMenuContentRef = {
      instance: {
        execute: new Subject(),
        close: new Subject(),
        openSubMenu: new Subject(),
        closeSubMenus: new Subject(),
      },
      onDestroy: jasmine.createSpy('onDestroy'),
      changeDetectorRef: {
        detectChanges: jasmine.createSpy('detectChanges'),
      },
    } as unknown as ComponentRef<ContextMenuContentComponent<unknown>>;
    overlayRefAttach = jasmine
      .createSpy('attach')
      .and.returnValue(contextMenuContentRef);
    overlayRefDetach = jasmine.createSpy('detach');
    overlayRefDispose = jasmine.createSpy('dispose');
    positionStrategy = {
      id: 'position-strategy',
    } as unknown as FlexibleConnectedPositionStrategy;
    overlayRef = {
      id: 'overlay-ref',
      attach: overlayRefAttach,
      detach: overlayRefDetach,
      dispose: overlayRefDispose,
    } as unknown as OverlayRef;
    overlayWithPositions = jasmine
      .createSpy('withPositions')
      .and.returnValue(positionStrategy);
    overlayCreate = jasmine.createSpy('create').and.returnValue(overlayRef);
    overlayFlexibleConnectedTo = jasmine
      .createSpy('flexibleConnectedTo')
      .and.returnValue({ withPositions: overlayWithPositions });
    overlayPosition = jasmine
      .createSpy('position')
      .and.returnValue({ flexibleConnectedTo: overlayFlexibleConnectedTo });
    closeScrollStrategy = {
      id: 'closeScrollStrategy',
    } as unknown as CloseScrollStrategy;
    scrollStrategyClose = jasmine
      .createSpy('strategyClose')
      .and.returnValue(closeScrollStrategy);
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [
        {
          provide: Overlay,
          useValue: {
            position: overlayPosition,
            create: overlayCreate,
          },
        },
        {
          provide: ScrollStrategyOptions,
          useValue: {
            close: scrollStrategyClose,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    contextMenuOverlaysService = TestBed.inject(ContextMenuOverlaysService);
    spyOn(contextMenuOverlaysService, 'push').and.callThrough();
    spyOn(contextMenuOverlaysService, 'closeAll').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should listen to overlays allClosed', () => {
      component.show({ anchoredTo: 'position', x: 0, y: 0 });
      expect(component.isOpen).toEqual(true);

      contextMenuOverlaysService.closeAll();

      expect(component.isOpen).toEqual(false);
    });
  });

  describe('#show', () => {
    describe('when open anchoredTo position', () => {
      it('should get a position strategy with position and create an overlay from it', () => {
        const context: ContextMenuOpenEvent<unknown> = {
          anchoredTo: 'position',
          x: 0,
          y: 0,
          value: {},
        };
        component.dir = undefined;
        component.menuClass = '';
        component.visibleMenuItems = [];
        component.show(context);

        expect(overlayPosition).toHaveBeenCalled();
        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith({
          x: 0,
          y: 0,
        });
        expect(overlayWithPositions).toHaveBeenCalledWith([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          },
        ]);
        expect(overlayCreate).toHaveBeenCalledWith({
          positionStrategy,
          panelClass: 'ngx-contextmenu-overlay',
          scrollStrategy: closeScrollStrategy,
        });

        expect(contextMenuOverlaysService.push).toHaveBeenCalledWith(
          overlayRef
        );
      });

      it('should get a position strategy with position LTR and create an overlay from it', () => {
        const context: ContextMenuOpenEvent<unknown> = {
          anchoredTo: 'position',
          x: 0,
          y: 0,
          value: {},
        };
        component.dir = 'ltr';
        component.menuClass = '';
        component.visibleMenuItems = [];
        component.show(context);

        expect(overlayPosition).toHaveBeenCalled();
        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith({
          x: 0,
          y: 0,
        });
        expect(overlayWithPositions).toHaveBeenCalledWith([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          },
        ]);
        expect(overlayCreate).toHaveBeenCalledWith({
          positionStrategy,
          panelClass: 'ngx-contextmenu-overlay',
          scrollStrategy: closeScrollStrategy,
        });

        expect(contextMenuOverlaysService.push).toHaveBeenCalledWith(
          overlayRef
        );
      });

      it('should get a position strategy with position parent LTR and create an overlay from it', () => {
        const context: ContextMenuOpenEvent<unknown> = {
          anchoredTo: 'position',
          x: 0,
          y: 0,
        };
        component.dir = 'ltr';
        component.menuClass = '';
        component.visibleMenuItems = [];
        component.show(context);

        expect(overlayPosition).toHaveBeenCalled();
        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith({
          x: 0,
          y: 0,
        });
        expect(overlayWithPositions).toHaveBeenCalledWith([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          },
        ]);
        expect(overlayCreate).toHaveBeenCalledWith({
          positionStrategy,
          panelClass: 'ngx-contextmenu-overlay',
          scrollStrategy: closeScrollStrategy,
        });

        expect(contextMenuOverlaysService.push).toHaveBeenCalledWith(
          overlayRef
        );
      });

      it('should get a position strategy with position RTL and create an overlay from it', () => {
        const context: ContextMenuOpenEvent<unknown> = {
          anchoredTo: 'position',
          x: 0,
          y: 0,
          value: {},
        };
        component.dir = 'rtl';
        component.menuClass = '';
        component.visibleMenuItems = [];
        component.show(context);

        expect(overlayPosition).toHaveBeenCalled();
        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith({
          x: 0,
          y: 0,
        });
        expect(overlayWithPositions).toHaveBeenCalledWith([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
        ]);
        expect(overlayCreate).toHaveBeenCalledWith({
          positionStrategy,
          panelClass: 'ngx-contextmenu-overlay',
          scrollStrategy: closeScrollStrategy,
        });

        expect(contextMenuOverlaysService.push).toHaveBeenCalledWith(
          overlayRef
        );
      });
    });

    describe('when open anchoredTo element', () => {
      it('should get a position strategy with anchor Element and create an overlay from it', () => {
        const anchorElement = document.createElement('div');
        const context: ContextMenuOpenEvent<unknown> = {
          anchoredTo: 'element',
          anchorElement,
          parentContextMenu: TestBed.createComponent(
            ContextMenuContentComponent
          ).componentInstance,
          value: {},
        };
        component.dir = undefined;
        component.menuClass = '';
        component.visibleMenuItems = [];
        context.parentContextMenu.dir = 'ltr';
        component.show(context);

        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith(
          jasmine.any(ElementRef)
        );
        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith(
          jasmine.objectContaining({
            nativeElement: anchorElement,
          })
        );
        expect(overlayWithPositions).toHaveBeenCalledWith([
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]);
        expect(overlayCreate).toHaveBeenCalledWith({
          positionStrategy,
          panelClass: 'ngx-contextmenu-overlay',
          scrollStrategy: closeScrollStrategy,
        });

        expect(contextMenuOverlaysService.push).toHaveBeenCalledWith(
          overlayRef
        );
      });

      it('should get a position strategy with anchor Element RTL and create an overlay from it', () => {
        const anchorElement = document.createElement('div');
        const context: ContextMenuOpenEvent<unknown> = {
          anchoredTo: 'element',
          anchorElement,
          parentContextMenu: TestBed.createComponent(
            ContextMenuContentComponent
          ).componentInstance,
          value: {},
        };
        component.dir = undefined;
        component.menuClass = '';
        component.visibleMenuItems = [];
        context.parentContextMenu.dir = 'rtl';
        component.show(context);

        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith(
          jasmine.any(ElementRef)
        );
        expect(overlayFlexibleConnectedTo).toHaveBeenCalledWith(
          jasmine.objectContaining({
            nativeElement: anchorElement,
          })
        );
        expect(overlayWithPositions).toHaveBeenCalledWith([
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'bottom',
          },
        ]);
        expect(overlayCreate).toHaveBeenCalledWith({
          positionStrategy,
          panelClass: 'ngx-contextmenu-overlay',
          scrollStrategy: closeScrollStrategy,
        });

        expect(contextMenuOverlaysService.push).toHaveBeenCalledWith(
          overlayRef
        );
      });
    });

    describe('with created contextMenuContentComponent', () => {
      let a: ContextMenuItemDirective<unknown>;
      let b: ContextMenuItemDirective<unknown>;
      let c: ContextMenuItemDirective<unknown>;
      let d: ContextMenuItemDirective<unknown>;
      let context: ContextMenuOpenEvent<unknown>;
      let value: unknown;

      beforeEach(() => {
        a = {
          visible: false,
        } as ContextMenuItemDirective<unknown>;
        b = {
          visible: true,
        } as ContextMenuItemDirective<unknown>;
        c = {
          visible: (item: unknown) => false,
        } as ContextMenuItemDirective<unknown>;
        d = {
          visible: (item: unknown) => true,
        } as ContextMenuItemDirective<unknown>;

        value = { id: 'a' };
        const menuItems = new QueryList<ContextMenuItemDirective<unknown>>();
        menuItems.reset([a, b, c, d]);
        component.menuItems = menuItems;
        component.menuClass = 'custom-class';
        component.dir = 'rtl';
        context = {
          anchoredTo: 'position',
          x: 0,
          y: 0,
          value,
        };
        component.dir = 'rtl';
        component.menuClass = 'menu-class';
        component.visibleMenuItems = [a, b, c, d];
      });

      it('should set contextMenuContentComponent properties', () => {
        component.show(context);
        expect(contextMenuContentRef.instance.value).toEqual({ id: 'a' });
        expect(contextMenuContentRef.instance.menuDirectives).toEqual([b, d]);
        expect(contextMenuContentRef.instance.menuClass).toEqual('menu-class');
        expect(contextMenuContentRef.instance.dir).toEqual('rtl');
      });

      it('should close all context menu when instance execute', () => {
        component.show(context);
        const event = {
          event: new MouseEvent('click'),
          item: { id: 'a' },
          menuDirective: a,
        };
        contextMenuContentRef.instance.execute.next(event);
        expect(overlayRef.detach).toHaveBeenCalledWith();
        expect(overlayRef.dispose).toHaveBeenCalledWith();
      });

      it('should dispose created component when emit on close', () => {
        component.show(context);
        contextMenuContentRef.instance.close.next();
        expect(overlayRef.detach).toHaveBeenCalledWith();
        expect(overlayRef.dispose).toHaveBeenCalledWith();
      });

      it('should close all menu items when instance is destroyed', () => {
        component.show(context);
        const close = jasmine.createSpy('subscriber');
        component.close.subscribe(close);
        (contextMenuContentRef.onDestroy as jasmine.Spy).calls.argsFor(0)[0]();
        expect(close).toHaveBeenCalled();
      });

      it('should detect changes on created instance', () => {
        component.show(context);
        expect(
          contextMenuContentRef.changeDetectorRef.detectChanges
        ).toHaveBeenCalled();
      });
    });
  });
});
