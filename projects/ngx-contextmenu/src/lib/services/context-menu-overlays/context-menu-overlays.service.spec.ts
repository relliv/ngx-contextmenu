import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { ContextMenuOverlaysService } from './context-menu-overlays.service';

describe('Service: ContextMenuOverlaysService', () => {
  let service: ContextMenuOverlaysService;

  const createOverlayRef = (): OverlayRef => {
    return TestBed.inject(Overlay).create();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
    });
    service = TestBed.inject(ContextMenuOverlaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#push', () => {
    it('should push an item to the stack', () => {
      expect(service.isEmpty()).toEqual(true);
      const item = createOverlayRef();
      service.push(item);
      expect(service.isEmpty()).toEqual(false);
      const item2 = createOverlayRef();
      service.push(item2);
      expect(service.isEmpty()).toEqual(false);
      const item3 = createOverlayRef();
      service.push(item3);
      expect(service.isEmpty()).toEqual(false);

      service.closeAll();
      expect(service.isEmpty()).toEqual(true);
    });
  });

  describe('#isEmpty', () => {
    it('should return true if the service is empty', () => {
      expect(service.isEmpty()).toEqual(true);
    });

    it('should return false if the service is not empty', () => {
      const item3 = createOverlayRef();
      service.push(item3);
      expect(service.isEmpty()).toEqual(false);
    });
  });

  describe('#closeAll', () => {
    it('should empty the service', () => {
      const item = createOverlayRef();
      service.push(item);

      service.closeAll();
      expect(service.isEmpty()).toEqual(true);
    });

    it('should emit on allClosed', () => {
      const subscriber = jasmine.createSpy('subscriber');
      service.allClosed.subscribe(subscriber);
      service.closeAll();
      expect(subscriber).toHaveBeenCalledWith(undefined);
    });
  });
});
