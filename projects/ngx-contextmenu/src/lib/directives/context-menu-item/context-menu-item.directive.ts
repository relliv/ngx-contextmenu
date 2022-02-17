import { Highlightable } from '@angular/cdk/a11y';
import {
  Directive,
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
} from '@angular/core';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { evaluateIfFunction } from '../../helper/evaluate';

@Directive({
  selector: '[contextMenuItem]',
})
export class ContextMenuItemDirective<T> implements Highlightable {
  /**
   * Optional subMenu component ref
   */
  @Input()
  public subMenu?: ContextMenuComponent<T>;

  /**
   * Is this menu item a divider
   */
  @Input()
  public divider = false;

  /**
   * Is this menu item enabled
   */
  @Input()
  public enabled: boolean | ((item?: T) => boolean) = true;

  /**
   * Is this menu item passive (for title)
   */
  @Input()
  public passive = false;

  /**
   * Is this menu item visible
   */
  @Input()
  public visible: boolean | ((item?: T) => boolean) = true;

  /**
   * Emits
   */
  @Output()
  public execute: EventEmitter<{
    event: MouseEvent | KeyboardEvent;
    item?: T;
  }> = new EventEmitter();

  /**
   * @internal
   */
  public item?: T;

  /**
   * @internal
   */
  public isActive = false;

  /**
   * @internal
   */
  public get disabled() {
    return (
      this.passive ||
      this.divider ||
      !evaluateIfFunction(this.enabled, this.item)
    );
  }

  constructor(
    @Optional()
    public template: TemplateRef<{ item: T }>
  ) {}

  public setActiveStyles(): void {
    this.isActive = true;
  }

  public setInactiveStyles(): void {
    this.isActive = false;
  }

  /**
   * @internal
   */
  public triggerExecute($event: MouseEvent | KeyboardEvent, item?: T): void {
    if (!evaluateIfFunction(this.enabled, item)) {
      return;
    }

    this.execute.emit({ event: $event, item });
  }
}
