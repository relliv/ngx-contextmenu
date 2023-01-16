import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuEventService } from '../context-menu-event/context-menu-event.service';
import { ContextMenuStackService } from '../context-menu-stack/context-menu-stack.service';
import { ContextMenuService } from './context-menu.service';

describe('Service: ContextMenuService', () => {
  let service: ContextMenuService<unknown>;
  let eventService: ContextMenuEventService<unknown>;
  let stackService: ContextMenuStackService<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContextMenuComponent],
      imports: [OverlayModule],
    });
    service = TestBed.inject(ContextMenuService);
    eventService = TestBed.inject(ContextMenuEventService);
    stackService = TestBed.inject(ContextMenuStackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#show', () => {
    it('should emit a show event', () => {
      spyOn(eventService, 'show');
      const component =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      service.show(component);
      expect(eventService.show).toHaveBeenCalledWith({
        anchoredTo: 'position',
        contextMenu: component,
        x: 0,
        y: 0,
        value: undefined,
      });
    });

    it('should emit a show event with options', () => {
      spyOn(eventService, 'show');
      const component =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      service.show(component, { x: 42, y: 34, value: { any: 'thing' } });
      expect(eventService.show).toHaveBeenCalledWith({
        anchoredTo: 'position',
        contextMenu: component,
        x: 42,
        y: 34,
        value: { any: 'thing' },
      });
    });
  });

  describe('#closeAll', () => {
    it('should trigger closeAll', () => {
      spyOn(stackService, 'closeAll');
      service.closeAll();
      expect(stackService.closeAll).toHaveBeenCalled();
    });
  });

  describe('#hasOpenMenu', () => {
    it('should trigger isEmpty', () => {
      spyOn(stackService, 'isEmpty');
      service.hasOpenMenu();
      expect(stackService.isEmpty).toHaveBeenCalled();
    });
  });
});
