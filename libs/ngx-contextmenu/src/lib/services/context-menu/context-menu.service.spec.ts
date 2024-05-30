import { TestBed } from '@angular/core/testing';
import { ContextMenuContentComponent } from '../../components/context-menu-content/context-menu-content.component';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ContextMenuOverlaysService } from '../context-menu-overlays/context-menu-overlays.service';
import { ContextMenuService } from './context-menu.service';

describe('Service: ContextMenuService', () => {
  let service: ContextMenuService<unknown>;
  let contextMenuOverlaysService: ContextMenuOverlaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContextMenuComponent, ContextMenuContentComponent],
    });
    service = TestBed.inject(ContextMenuService);
    contextMenuOverlaysService = TestBed.inject(ContextMenuOverlaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#show', () => {
    it('should emit a show event', () => {
      const component =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      jest.spyOn(component, 'show');
      service.show(component);
      expect(component.show).toHaveBeenCalledWith({
        anchoredTo: 'position',
        x: 0,
        y: 0,
        value: undefined,
      });
    });

    it('should emit a show event with options', () => {
      const component =
        TestBed.createComponent(ContextMenuComponent).componentInstance;
      jest.spyOn(component, 'show');
      service.show(component, { x: 42, y: 34, value: { any: 'thing' } });
      expect(component.show).toHaveBeenCalledWith({
        anchoredTo: 'position',
        x: 42,
        y: 34,
        value: { any: 'thing' },
      });
    });
  });

  describe('#closeAll', () => {
    it('should trigger closeAll', () => {
      jest.spyOn(contextMenuOverlaysService, 'closeAll');
      service.closeAll();
      expect(contextMenuOverlaysService.closeAll).toHaveBeenCalled();
    });
  });

  describe('#hasOpenMenu', () => {
    it('should get information from overlays service', () => {
      const spy = jest
        .spyOn(contextMenuOverlaysService, 'isEmpty')
        .mockReturnValue(true);
      expect(service.hasOpenMenu()).toEqual(false);
      spy.mockReturnValue(false);
      expect(service.hasOpenMenu()).toEqual(true);
      expect(contextMenuOverlaysService.isEmpty).toHaveBeenCalledTimes(2);
    });
  });
});
