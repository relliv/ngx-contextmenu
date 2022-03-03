import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContextMenuOpenEvent } from '@perfectmemory/ngx-contextmenu';

@Component({
  selector: 'storybook-ngx-contextmenu',
  templateUrl: 'ngx-contextmenu.component.html',
  styleUrls: ['./ngx-contextmenu.component.scss'],
})
export default class NgxContextMenuComponent {
  @Input()
  public menuClass = '';

  @Input()
  public disabled = false;

  @Input()
  public dir: 'ltr' | 'rtl' | undefined;

  @Input()
  public item: unknown = 'a user defined item';

  @Input()
  public demoMode: 'simple' | 'form' = 'simple';

  @Output()
  public onOpen = new EventEmitter<ContextMenuOpenEvent<unknown>>();

  @Output()
  public onClose = new EventEmitter<'void'>();

  @Output()
  public onMenuItemExecuted = new EventEmitter<string>();

  /**
   * @internal
   */
  public execute(value: string) {
    this.onMenuItemExecuted.next(value);
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
