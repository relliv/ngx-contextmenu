import { FocusKeyManager } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ElementRef,
  EventEmitter,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ContextMenuContentItemDirective } from '../../directives/context-menu-content-item/context-menu-content-item.directive';
import { ContextMenuItemDirective } from '../../directives/context-menu-item/context-menu-item.directive';
import { ContextMenuOverlaysService } from '../../services/context-menu-overlays/context-menu-overlays.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import {
  ContextMenuContentComponent,
  TESTING_WRAPPER,
} from './context-menu-content.component';

describe('Component: ContextMenuContentComponent', () => {
  let component: ContextMenuContentComponent<unknown>;
  let fixture: ComponentFixture<ContextMenuContentComponent<unknown>>;
  let focusKeyManager: FocusKeyManager<
    ContextMenuContentItemDirective<unknown>
  >;
  let contextMenuOverlaysService: ContextMenuOverlaysService;

  const configureTestingModule = (autoFocus?: boolean) => {
    mockFocusKeyManager();
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [
        ContextMenuService,
        ...(typeof autoFocus === 'boolean' ? [] : []),
      ],
      declarations: [ContextMenuContentComponent],
    });
    fixture = TestBed.createComponent(ContextMenuContentComponent);
    contextMenuOverlaysService = TestBed.inject(ContextMenuOverlaysService);
    component = fixture.componentInstance;
  };

  const mockFocusKeyManager = () => {
    focusKeyManager = new FocusKeyManager(new QueryList());
    jest.spyOn(focusKeyManager, 'onKeydown');

    jest.spyOn(TESTING_WRAPPER, 'FocusKeyManager').mockReturnValue({
      withWrap: jest.fn().mockReturnValue(focusKeyManager),
    } as unknown as FocusKeyManager<ContextMenuContentItemDirective<unknown>>);
  };

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    configureTestingModule();
    expect(component).toBeTruthy();
  });

  describe('#ngAfterViewInit', () => {
    it('should set item to each menu item property', () => {
      configureTestingModule();
      component.menuDirectives = [
        { value: undefined, execute: new Subject() },
        { value: undefined, execute: new Subject() },
        { value: undefined, execute: new Subject() },
      ] as ContextMenuItemDirective<unknown>[];

      component.value = { id: 'a' };

      component.ngAfterViewInit();

      expect(component.menuDirectives).toEqual([
        expect.objectContaining({ value: component.value }),
        expect.objectContaining({ value: component.value }),
        expect.objectContaining({ value: component.value }),
      ]);
    });

    it('should bind menuItem execution to execute emitter', () => {
      configureTestingModule();
      const execute = jest.fn();
      component.execute.subscribe(execute);

      const emitterA = new EventEmitter();
      const emitterB = new EventEmitter();
      const emitterC = new EventEmitter();

      const menuA: ContextMenuItemDirective<unknown> = {
        value: undefined,
        execute: emitterA,
      } as ContextMenuItemDirective<unknown>;
      const menuB: ContextMenuItemDirective<unknown> = {
        value: undefined,
        execute: emitterB,
      } as ContextMenuItemDirective<unknown>;
      const menuC: ContextMenuItemDirective<unknown> = {
        value: undefined,
        execute: emitterC,
      } as ContextMenuItemDirective<unknown>;
      component.menuDirectives = [menuA, menuB, menuC];

      component.ngAfterViewInit();

      const eventA = {
        event: new MouseEvent('click'),
        item: { id: 'a' },
      };
      const eventB = {
        event: new MouseEvent('click'),
        item: { id: 'a' },
      };
      const eventC = {
        event: new MouseEvent('click'),
        item: { id: 'a' },
      };
      emitterA.emit(eventA);
      expect(execute).toHaveBeenCalledWith({ ...eventA, menuDirective: menuA });
      emitterB.emit(eventB);
      expect(execute).toHaveBeenCalledWith({ ...eventB, menuDirective: menuB });
      emitterC.emit(eventC);
      expect(execute).toHaveBeenCalledWith({ ...eventC, menuDirective: menuC });
      expect(execute).toHaveBeenCalledTimes(3);
    });

    it('should not fail if overlay is not defined', () => {
      configureTestingModule();
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe('#stopEvent', () => {
    it('should stop event propagation', () => {
      configureTestingModule();
      const event = new MouseEvent('click');
      jest.spyOn(event, 'stopPropagation');
      component.stopEvent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('#isMenuItemDisabled', () => {
    it('should return true if menu is disabled', () => {
      configureTestingModule();
      const menu: ContextMenuItemDirective<unknown> = {
        disabled: true,
      } as ContextMenuItemDirective<unknown>;
      expect(component.isMenuItemDisabled(menu)).toBe(true);
    });

    it('should return false if menu is not disabled', () => {
      configureTestingModule();
      const menu: ContextMenuItemDirective<unknown> = {
        disabled: false,
      } as ContextMenuItemDirective<unknown>;
      expect(component.isMenuItemDisabled(menu)).toBe(false);
    });

    it('should return true if the evaluation of the menu disabled property is true', () => {
      configureTestingModule();
      const menu: ContextMenuItemDirective<unknown> = {
        disabled: (_item: unknown) => true,
      } as unknown as ContextMenuItemDirective<unknown>;
      expect(component.isMenuItemDisabled(menu)).toBe(true);
    });

    it('should return false if the evaluation of the menu disabled property is false', () => {
      configureTestingModule();
      const menu: ContextMenuItemDirective<unknown> = {
        disabled: (_item: unknown) => false,
      } as unknown as ContextMenuItemDirective<unknown>;
      expect(component.isMenuItemDisabled(menu)).toBe(false);
    });
  });

  describe('#isMenuItemVisible', () => {
    it('should return true if menu is visible', () => {
      configureTestingModule();
      const menu: ContextMenuContentItemDirective<unknown> = {
        contextMenuContentItem: {
          visible: true,
        },
      } as unknown as ContextMenuContentItemDirective<unknown>;
      expect(component.isMenuItemVisible(menu)).toBe(true);
    });

    it('should return false if menu is not visible', () => {
      configureTestingModule();
      const menu: ContextMenuContentItemDirective<unknown> = {
        contextMenuContentItem: {
          visible: false,
        },
      } as unknown as ContextMenuContentItemDirective<unknown>;
      expect(component.isMenuItemVisible(menu)).toBe(false);
    });

    it('should return true if the evaluation of the menu visible property is true', () => {
      configureTestingModule();
      const menu: ContextMenuContentItemDirective<unknown> = {
        contextMenuContentItem: {
          visible: (item: unknown) => true,
        },
      } as unknown as ContextMenuContentItemDirective<unknown>;
      expect(component.isMenuItemVisible(menu)).toBe(true);
    });

    it('should return false if the evaluation of the menu visible property is false', () => {
      configureTestingModule();
      const menu: ContextMenuContentItemDirective<unknown> = {
        contextMenuContentItem: {
          visible: (item: unknown) => false,
        },
      } as unknown as ContextMenuContentItemDirective<unknown>;
      expect(component.isMenuItemVisible(menu)).toBe(false);
    });
  });

  describe('#onKeyArrowDownOrUp', () => {
    it('should pass event to keyManager', () => {
      configureTestingModule();
      component.ngAfterViewInit();
      const event = new KeyboardEvent('mousedown');
      component.onKeyArrowDownOrUp(event);
      expect(focusKeyManager.onKeydown).toHaveBeenCalledWith(event);
    });
  });

  describe('#onKeyArrowRight', () => {
    describe('when ltr', () => {
      beforeEach(() => {
        configureTestingModule();
        jest.spyOn(component, 'openSubMenu');
      });

      it('should open active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowRight(event);
        expect(component.openSubMenu).toHaveBeenCalledWith(
          focusKeyManager.activeItem?.contextMenuContentItem?.subMenu,
          event
        );
      });

      it('should not open sub menu if there is no active', () => {
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowRight(event);
        expect(component.openSubMenu).not.toHaveBeenCalled();
      });
    });

    describe('when rtl', () => {
      beforeEach(() => {
        configureTestingModule();
        jest.spyOn(component, 'openSubMenu');
        component.dir = 'rtl';
      });

      it('should not open active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowRight(event);
        expect(component.openSubMenu).not.toHaveBeenCalled();
      });

      it('should close active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown', { keyCode: 39 });
        component.onKeyArrowRight(event);

        expect(close).toHaveBeenCalledWith(undefined);
      });

      it('should not close active sub menu if activeItemIndex is null', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        jest
          .spyOn(focusKeyManager, 'activeItemIndex', 'get')
          .mockReturnValue(null);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown', { keyCode: 39 });
        component.onKeyArrowRight(event);
        expect(close).not.toHaveBeenCalled();
      });

      it('should close active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown', { keyCode: 37 });
        component.onKeyArrowRight(event);
        expect(close).toHaveBeenCalledWith(undefined);
      });

      it('should not close active sub menu if this is not leaf', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowRight(event);
        expect(close).not.toHaveBeenCalledWith();
      });

      it('should not close active sub menu if there is no active item', () => {
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowRight(event);
        expect(close).not.toHaveBeenCalledWith();
      });
    });

    it('should cancel event', () => {
      configureTestingModule();
      const directive = new ContextMenuContentItemDirective(
        undefined as unknown as ElementRef<HTMLElement>
      );
      jest
        .spyOn(focusKeyManager, 'activeItem', 'get')
        .mockReturnValue(directive);
      jest.spyOn(component, 'openSubMenu');
      component.ngAfterViewInit();
      const event = new KeyboardEvent('mousedown');
      jest
        .spyOn(event, 'target', 'get')
        .mockReturnValue(document.createElement('div'));
      jest.spyOn(event, 'preventDefault');
      jest.spyOn(event, 'stopPropagation');
      component.onKeyArrowRight(event);
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
    });

    ['input', 'textarea', 'select'].forEach((tagName) => {
      it(`should not cancel event if event target is "${tagName}"`, () => {
        configureTestingModule();
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        jest.spyOn(component, 'openSubMenu');
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        jest
          .spyOn(event, 'target', 'get')
          .mockReturnValue(document.createElement(tagName));
        jest.spyOn(event, 'preventDefault');
        jest.spyOn(event, 'stopPropagation');
        component.onKeyArrowRight(event);
        expect(event.preventDefault).not.toHaveBeenCalledWith();
        expect(event.stopPropagation).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('#onKeyArrowLeft', () => {
    describe('when rtl', () => {
      beforeEach(() => {
        configureTestingModule();
        jest.spyOn(component, 'openSubMenu');
        component.dir = 'rtl';
      });

      it('should open active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowLeft(event);
        expect(component.openSubMenu).toHaveBeenCalledWith(
          focusKeyManager.activeItem?.contextMenuContentItem?.subMenu,
          event
        );
      });

      it('should not close active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowLeft(event);
        expect(close).not.toHaveBeenCalled();
      });

      it('should not open sub menu if there is no active', () => {
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowLeft(event);
        expect(component.openSubMenu).not.toHaveBeenCalled();
      });
    });

    describe('when ltr', () => {
      beforeEach(() => {
        configureTestingModule();
        jest.spyOn(component, 'openSubMenu');
      });

      it('should not open active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowLeft(event);
        expect(component.openSubMenu).not.toHaveBeenCalled();
      });

      it('should close active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown', { keyCode: 37 });
        component.onKeyArrowLeft(event);
        expect(close).toHaveBeenCalledWith(undefined);
      });

      it('should close active sub menu', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown', { keyCode: 39 });
        component.onKeyArrowLeft(event);
        expect(close).toHaveBeenCalledWith(undefined);
      });

      it('should not close active sub menu if this is not leaf', () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowLeft(event);
        expect(close).not.toHaveBeenCalledWith();
      });

      it('should not close active sub menu if there is no active item', () => {
        const close = jest.fn();
        component.close.subscribe(close);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        component.onKeyArrowLeft(event);
        expect(close).not.toHaveBeenCalledWith();
      });
    });

    it('should cancel event', () => {
      configureTestingModule();
      const directive = new ContextMenuContentItemDirective(
        undefined as unknown as ElementRef<HTMLElement>
      );

      jest
        .spyOn(focusKeyManager, 'activeItem', 'get')
        .mockReturnValue(directive);
      jest.spyOn(component, 'openSubMenu');
      component.ngAfterViewInit();
      const event = new KeyboardEvent('mousedown');
      jest
        .spyOn(event, 'target', 'get')
        .mockReturnValue(document.createElement('div'));
      jest.spyOn(event, 'preventDefault');
      jest.spyOn(event, 'stopPropagation');
      component.onKeyArrowLeft(event);
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
    });

    ['input', 'textarea', 'select'].forEach((tagName) => {
      it(`should not cancel event if event target is "${tagName}"`, () => {
        configureTestingModule();
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        jest.spyOn(component, 'openSubMenu');
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        jest
          .spyOn(event, 'target', 'get')
          .mockReturnValue(document.createElement(tagName));
        jest.spyOn(event, 'preventDefault');
        jest.spyOn(event, 'stopPropagation');
        component.onKeyArrowLeft(event);
        expect(event.preventDefault).not.toHaveBeenCalledWith();
        expect(event.stopPropagation).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('#onKeyEnterOrSpace', () => {
    beforeEach(() => {
      configureTestingModule();
      jest.spyOn(component, 'openSubMenu');
    });

    it('should open active sub menu', () => {
      const directive = new ContextMenuContentItemDirective(
        undefined as unknown as ElementRef<HTMLElement>
      );

      jest
        .spyOn(focusKeyManager, 'activeItem', 'get')
        .mockReturnValue(directive);
      component.ngAfterViewInit();
      const event = new KeyboardEvent('mousedown');
      component.onKeyEnterOrSpace(event);
      expect(component.openSubMenu).toHaveBeenCalledWith(
        focusKeyManager.activeItem?.contextMenuContentItem?.subMenu,
        event
      );
    });

    it('should not open sub menu if there is no active sub menu', () => {
      component.ngAfterViewInit();
      const event = new KeyboardEvent('mousedown');
      component.onKeyEnterOrSpace(event);
      expect(component.openSubMenu).not.toHaveBeenCalled();
    });

    it('should cancel event', () => {
      const directive = new ContextMenuContentItemDirective(
        undefined as unknown as ElementRef<HTMLElement>
      );

      jest
        .spyOn(focusKeyManager, 'activeItem', 'get')
        .mockReturnValue(directive);
      component.ngAfterViewInit();
      const event = new KeyboardEvent('mousedown');
      jest
        .spyOn(event, 'target', 'get')
        .mockReturnValue(document.createElement('div'));
      jest.spyOn(event, 'preventDefault');
      jest.spyOn(event, 'stopPropagation');
      component.onKeyEnterOrSpace(event);
      expect(event.preventDefault).toHaveBeenCalledWith();
      expect(event.stopPropagation).toHaveBeenCalledWith();
    });

    ['input', 'textarea', 'select'].forEach((tagName) => {
      it(`should not cancel event if event target is "${tagName}"`, () => {
        const directive = new ContextMenuContentItemDirective(
          undefined as unknown as ElementRef<HTMLElement>
        );

        jest
          .spyOn(focusKeyManager, 'activeItem', 'get')
          .mockReturnValue(directive);
        component.ngAfterViewInit();
        const event = new KeyboardEvent('mousedown');
        jest
          .spyOn(event, 'target', 'get')
          .mockReturnValue(document.createElement(tagName));
        jest.spyOn(event, 'preventDefault');
        jest.spyOn(event, 'stopPropagation');
        component.onKeyEnterOrSpace(event);
        expect(event.preventDefault).not.toHaveBeenCalledWith();
        expect(event.stopPropagation).not.toHaveBeenCalledWith();
      });
    });
  });

  describe('#onClickOrRightClick', () => {
    let mouseEvent: MouseEvent;
    let close: jest.Mock;

    beforeEach(() => {
      configureTestingModule();
      close = jest.fn();
      component.close.subscribe(close);
      jest.spyOn(contextMenuOverlaysService, 'closeAll');
    });

    it('should close all menus', () => {
      mouseEvent = new MouseEvent('click');
      component.onClickOrRightClick(mouseEvent);
      expect(contextMenuOverlaysService.closeAll).toHaveBeenCalledWith();
    });

    it('should not close all menus if this is a click event with right button (not the same as contextmenu event)', () => {
      mouseEvent = new MouseEvent('click', { button: 2 });
      component.onClickOrRightClick(mouseEvent);
      expect(close).not.toHaveBeenCalled();
    });

    it('should not close all menus if the event is within the current contextmenu', () => {
      mouseEvent = new MouseEvent('click');
      const target = document.createElement('div');
      jest.spyOn(mouseEvent, 'target', 'get').mockReturnValue(target);
      jest
        .spyOn(fixture.elementRef.nativeElement, 'contains')
        .mockReturnValue(true);
      component.onClickOrRightClick(mouseEvent);
      expect(fixture.elementRef.nativeElement.contains).toHaveBeenCalledWith(
        target
      );
      expect(close).not.toHaveBeenCalled();
    });
  });

  describe('#onCloseLeafMenu', () => {
    let event: KeyboardEvent;
    let close: jest.Mock;

    beforeEach(() => {
      configureTestingModule();

      component.ngAfterViewInit();

      close = jest.fn();
      component.close.subscribe(close);
    });

    it('should close', () => {
      event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: document.createElement('div'),
      } as unknown as KeyboardEvent;
      component.onKeyArrowLeft(event);
      expect(close).toHaveBeenCalledWith(undefined);
    });

    it('should close when key press is arrow left', () => {
      event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
        target: document.createElement('div'),
        keyCode: 37,
      } as unknown as KeyboardEvent;
      component.onKeyArrowLeft(event);
      expect(close).toHaveBeenCalledWith(undefined);
    });

    describe('when event target is an arbitrary html element', () => {
      it('should stop event propagation', () => {
        event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          target: document.createElement('div'),
        } as unknown as KeyboardEvent;
        component.onKeyArrowLeft(event);
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should prevent default event', () => {
        event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          target: document.createElement('div'),
        } as unknown as KeyboardEvent;
        component.onKeyArrowLeft(event);
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
    describe('when event target is not an arbitrary html element', () => {
      it('should not stop event propagation if event target is undefined', () => {
        event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          target: undefined,
        } as unknown as KeyboardEvent;
        component.onKeyArrowLeft(event);
        expect(event.stopPropagation).not.toHaveBeenCalled();
      });

      it('should not prevent default event if event target is undefined', () => {
        event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          target: undefined,
        } as unknown as KeyboardEvent;
        component.onKeyArrowLeft(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should not stop event propagation if event target is contentEditable', () => {
        const div = document.createElement('div');
        // jest.spyOn(div, 'isContentEditable', 'get').mockReturnValue(true);
        (div as any).isContentEditable = true;
        event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          target: div,
        } as unknown as KeyboardEvent;
        component.onKeyArrowLeft(event);
        expect(event.stopPropagation).not.toHaveBeenCalled();
      });

      it('should not prevent default event if event target is contentEditable', () => {
        const div = document.createElement('div');
        // jest.spyOn(div, 'isContentEditable', 'get').mockReturnValue(true);
        (div as any).isContentEditable = true;
        event = {
          stopPropagation: jest.fn(),
          preventDefault: jest.fn(),
          target: div,
        } as unknown as KeyboardEvent;
        component.onKeyArrowLeft(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      ['input', 'textarea', 'select'].forEach((tag) => {
        it(`should not stop event propagation if event target is an <${tag}>`, () => {
          event = {
            stopPropagation: jest.fn(),
            preventDefault: jest.fn(),
            target: document.createElement(tag),
          } as unknown as KeyboardEvent;
          component.onKeyArrowLeft(event);
          expect(event.stopPropagation).not.toHaveBeenCalled();
        });

        it(`should not prevent default event if event target is is an <${tag}>`, () => {
          event = {
            stopPropagation: jest.fn(),
            preventDefault: jest.fn(),
            target: document.createElement(tag),
          } as unknown as KeyboardEvent;
          component.onKeyArrowLeft(event);
          expect(event.preventDefault).not.toHaveBeenCalled();
        });
      });
    });

    it('should not stop event propagation if is not isLeaf', () => {
      event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as unknown as KeyboardEvent;
      component.onKeyArrowLeft(event);
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('#closeMenu', () => {
    beforeEach(() => {
      configureTestingModule();
      jest.spyOn(contextMenuOverlaysService, 'closeAll');
    });

    it('should not close all if it is a right click', () => {
      const event = new MouseEvent('click', { button: 2 });
      component.onClickOrRightClick(event);
      expect(contextMenuOverlaysService.closeAll).not.toHaveBeenCalled();
    });

    it('should close all if event is not a click', () => {
      const event = new MouseEvent('mousedown', { button: 2 });
      component.onClickOrRightClick(event);
      expect(contextMenuOverlaysService.closeAll).toHaveBeenCalledWith();
    });

    it('should close all if event is not a right click', () => {
      const event = new MouseEvent('click', { button: 1 });
      component.onClickOrRightClick(event);
      expect(contextMenuOverlaysService.closeAll).toHaveBeenCalledWith();
    });
  });

  describe('#onMenuItemSelect', () => {
    let menuContentItem: ContextMenuContentItemDirective<unknown>;
    let event: MouseEvent;

    beforeEach(() => {
      configureTestingModule();
      menuContentItem = new ContextMenuContentItemDirective({} as ElementRef);
      menuContentItem.contextMenuContentItem = new ContextMenuItemDirective(
        {} as TemplateRef<{ $implicit: unknown }>
      );
      menuContentItem.contextMenuContentItem.subMenu =
        TestBed.createComponent(ContextMenuComponent).componentInstance;

      jest.spyOn(menuContentItem.contextMenuContentItem, 'triggerExecute');
      jest.spyOn(component, 'openSubMenu');
      component.value = { id: 'a' };
      event = new MouseEvent('click');
      jest.spyOn(event, 'stopPropagation');
      jest.spyOn(event, 'preventDefault');
      jest
        .spyOn(event, 'target', 'get')
        .mockReturnValue(document.createElement('div'));
    });

    it('should stop event propagation', () => {
      component.onMenuItemSelect(menuContentItem, event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should preventDefault event', () => {
      component.onMenuItemSelect(menuContentItem, event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should try to open sub menu', () => {
      component.onMenuItemSelect(menuContentItem, event);
      expect(component.openSubMenu).toHaveBeenCalledWith(
        menuContentItem.contextMenuContentItem?.subMenu,
        event
      );
    });

    it('should execute if there is no sub menu', () => {
      delete menuContentItem.contextMenuContentItem?.subMenu;
      component.onMenuItemSelect(menuContentItem, event);
      expect(
        menuContentItem?.contextMenuContentItem?.triggerExecute
      ).toHaveBeenCalledWith(event, component.value);
    });

    it('should not execute if there is sub menu', () => {
      component.onMenuItemSelect(menuContentItem, event);
      expect(
        menuContentItem?.contextMenuContentItem?.triggerExecute
      ).not.toHaveBeenCalled();
    });
  });

  describe('#openSubMenu', () => {
    beforeEach(() => {
      configureTestingModule();
      component.contextMenuContentItems = new QueryList();
    });

    it('should show subMenu', () => {
      const subMenu =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      const event = new MouseEvent('click');

      jest.spyOn(subMenu, 'show');
      component.openSubMenu(subMenu, event);

      expect(subMenu.show).toHaveBeenCalledWith({
        anchoredTo: 'position',
        x: 0,
        y: 0,
        value: undefined,
      });
    });

    it('should not show subMenu if already opened', () => {
      const subMenu =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      const event = new MouseEvent('click');
      jest.spyOn(subMenu, 'isOpen', 'get').mockReturnValue(true);
      jest.spyOn(subMenu, 'show');
      component.openSubMenu(subMenu, event);

      expect(subMenu.show).not.toHaveBeenCalled();
    });

    it('should not throw if subMenu does not exist', () => {
      const subMenu =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      const event = new MouseEvent('click');

      jest.spyOn(subMenu, 'show');
      expect(() => {
        component.openSubMenu(undefined, event);
      }).not.toThrow();
    });
  });
});
