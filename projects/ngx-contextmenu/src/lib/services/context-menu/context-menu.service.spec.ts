import {
  CloseScrollStrategy,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayModule,
  OverlayRef,
  ScrollStrategyOptions,
} from '@angular/cdk/overlay';
import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ContextMenuContentComponent } from '../../components/context-menu-content/context-menu-content.component';
import { ContextMenuService } from './context-menu.service';

describe('Service: ContextMenuService', () => {
  let service: ContextMenuService<unknown>;
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
  let contextMenuContentComponent: ContextMenuContentComponent<unknown>;

  beforeEach(() => {
    contextMenuContentRef = {
      instance: {
        execute: new Subject(),
        closeAllMenus: new Subject(),
        closeLeafMenu: new Subject(),
        openSubMenu: new Subject(),
      },
      onDestroy: jasmine.createSpy('onDestroy'),
      changeDetectorRef: {
        detectChanges: jasmine.createSpy('detectChanges'),
      },
    } as unknown as ComponentRef<ContextMenuContentComponent<unknown>>;
    contextMenuContentComponent = {
      id: 'ContextMenuContentComponent',
    } as unknown as ContextMenuContentComponent<unknown>;
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
        ContextMenuService,
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
    service = TestBed.inject(ContextMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
