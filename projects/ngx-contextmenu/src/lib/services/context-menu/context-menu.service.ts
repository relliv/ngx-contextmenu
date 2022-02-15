import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CloseContextMenuEvent,
  IContextMenuOpenEvent,
} from '../../components/context-menu/context-menu.component.interface';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  public show: Subject<IContextMenuOpenEvent> = new Subject();
  /*   public close: Subject<CloseContextMenuEvent> = new Subject(); */

  public display(event: IContextMenuOpenEvent) {
    this.show.next(event);
  }

  /*   public hide(event: CloseContextMenuEvent) {
    this.close.next(event);
  } */
}
