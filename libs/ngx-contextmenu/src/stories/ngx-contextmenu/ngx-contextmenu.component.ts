import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ContextMenuOpenEvent } from '../../lib/components/context-menu/context-menu.component.interface';
import { ContextMenuDirective } from '../../lib/directives/context-menu/context-menu.directive';

@Component({
  selector: 'storybook-context-menu',
  templateUrl: 'ngx-contextmenu.component.html',
  styleUrls: ['./ngx-contextmenu.component.scss'],
})
export default class StorybookContextMenuComponent {
  @Input()
  public menuClass = '';

  @Input()
  public disabled = false;

  @Input()
  public dir: 'ltr' | 'rtl' | undefined;

  @Input()
  public value: unknown = 'a user defined item';

  @Input()
  public demoMode: 'simple' | 'form' = 'simple';

  @Input()
  public programmaticOpen = false;

  @Output()
  public onOpen = new EventEmitter<ContextMenuOpenEvent<unknown>>();

  @Output()
  public onClose = new EventEmitter<'void'>();

  @Output()
  public onMenuItemExecuted = new EventEmitter<string>();

  /**
   * @internal
   */
  @ViewChild(ContextMenuDirective)
  public contextMenuDirective?: ContextMenuDirective<void>;

  /**
   * @internal
   */
  public execute(text: string, value: any) {
    console.log(value);
    this.onMenuItemExecuted.next(`${text}: ${value.value}`);
  }

  /**
   * @internal
   */
  public open(value: ContextMenuOpenEvent<unknown>) {
    this.onOpen.next(value);
  }

  /**
   * @internal
   */
  public close() {
    this.onClose.next('void');
  }
}
