import { OverlayModule } from '@angular/cdk/overlay';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuEventService } from '../../services/context-menu-event/context-menu-event.service';
import { ContextMenuStackService } from '../../services/context-menu-stack/context-menu-stack.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ContextMenuDirective } from './context-menu.directive';

@Component({
  template: '<div contextMenu></div>',
})
class TestHostComponent {}

describe('Directive: ContextMenuDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: ContextMenuDirective<unknown>;
  let contextMenuEventService: ContextMenuEventService<unknown>;
  let contextMenuStackService: ContextMenuStackService<unknown>;
  let onShow: jasmine.Spy<jasmine.Func>;
  let directiveEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [ContextMenuEventService],
      declarations: [ContextMenuDirective, TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    directiveEl = fixture.debugElement.query(
      By.directive(ContextMenuDirective)
    );
    directive = directiveEl.injector.get(ContextMenuDirective);
    contextMenuEventService = TestBed.inject(ContextMenuEventService);
    contextMenuStackService = TestBed.inject(ContextMenuStackService);
    onShow = jasmine.createSpy('onShow');
    contextMenuEventService.onShow.subscribe(onShow);
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('#new', () => {
    it('should create an instance', () => {
      expect(directive).toBeTruthy();
    });
  });

  describe('#onContextMenu', () => {
    it('should show attached context menu', () => {
      directive.contextMenu =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      directive.contextMenuValue = { id: 'a' };
      const event = new MouseEvent('contextmenu', { clientX: 42, clientY: 34 });
      directive.onContextMenu(event);
      expect(onShow).toHaveBeenCalledWith({
        anchoredTo: 'position',
        contextMenu: directive.contextMenu,
        x: 42,
        y: 34,
        value: directive.contextMenuValue,
      });
    });

    it('should not show attached context menu if it is disabled', () => {
      directive.contextMenu =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      directive.contextMenu.disabled = true;
      directive.contextMenuValue = { id: 'a' };
      const event = new MouseEvent('contextmenu');
      directive.onContextMenu(event);
      expect(onShow).not.toHaveBeenCalled();
    });

    it('should show nothing if not context menu is attached', () => {
      directive.contextMenuValue = { id: 'a' };
      const event = new MouseEvent('contextmenu');
      directive.onContextMenu(event);
      expect(onShow).not.toHaveBeenCalled();
    });
  });

  describe('#open', () => {
    describe('when using mouse event', () => {
      it('should show attached context menu', () => {
        directive.contextMenu =
          TestBed.createComponent(ContextMenuComponent).componentInstance;
        directive.contextMenuValue = { id: 'a' };
        const event = new MouseEvent('contextmenu', {
          clientX: 42,
          clientY: 34,
        });
        directive.open(event);
        expect(onShow).toHaveBeenCalledWith({
          anchoredTo: 'position',
          contextMenu: directive.contextMenu,
          x: 42,
          y: 34,
          value: directive.contextMenuValue,
        });
      });

      it('should not show attached context menu if it is disabled', () => {
        directive.contextMenu =
          TestBed.createComponent(ContextMenuComponent).componentInstance;
        directive.contextMenu.disabled = true;
        directive.contextMenuValue = { id: 'a' };
        const event = new MouseEvent('contextmenu');
        directive.open(event);
        expect(onShow).not.toHaveBeenCalled();
      });

      it('should show nothing if not context menu is attached', () => {
        directive.contextMenuValue = { id: 'a' };
        const event = new MouseEvent('contextmenu');
        directive.open(event);
        expect(onShow).not.toHaveBeenCalled();
      });
    });

    describe('when using no event', () => {
      it('should show attached context menu', () => {
        const fixture = TestBed.createComponent(ContextMenuComponent);
        directive.contextMenu = fixture.componentInstance;
        spyOn(
          directiveEl.nativeElement as HTMLElement,
          'getBoundingClientRect'
        ).and.returnValue({
          x: 100,
          y: 200,
          height: 20,
        } as DOMRect);
        directive.contextMenuValue = { id: 'a' };
        directive.open();
        expect(onShow).toHaveBeenCalledWith({
          anchoredTo: 'position',
          contextMenu: directive.contextMenu,
          x: 100,
          y: 220,
          value: directive.contextMenuValue,
        });
      });

      it('should not show attached context menu if it is disabled', () => {
        directive.contextMenu =
          TestBed.createComponent(ContextMenuComponent).componentInstance;
        directive.contextMenu.disabled = true;
        directive.contextMenuValue = { id: 'a' };
        directive.open();
        expect(onShow).not.toHaveBeenCalled();
      });

      it('should show nothing if not context menu is attached', () => {
        directive.contextMenuValue = { id: 'a' };
        directive.open();
        expect(onShow).not.toHaveBeenCalled();
      });
    });
  });

  describe('#close', () => {
    it('should close all context menu', () => {
      spyOn(contextMenuStackService, 'closeAll');
      directive.close();
      expect(contextMenuStackService.closeAll).toHaveBeenCalledWith();
    });
  });
});
