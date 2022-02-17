import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IContextMenuOpenEvent } from '../../components/context-menu/context-menu.component.interface';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class ContextMenuEventService<T> {
  public onShow: Subject<IContextMenuOpenEvent<T>> = new Subject();

  public show(options: IContextMenuOpenEvent<T>) {
    this.onShow.next(options);
  }
}
