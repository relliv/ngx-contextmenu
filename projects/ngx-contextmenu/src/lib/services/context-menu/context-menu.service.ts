import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  CloseContextMenuEvent,
  IContextMenuOpenEvent,
} from '../../components/context-menu/context-menu.component.interface';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService<T> {
  public show: Subject<IContextMenuOpenEvent<T>> = new Subject();

  public display(event: IContextMenuOpenEvent<T>) {
    this.show.next(event);
  }
}
