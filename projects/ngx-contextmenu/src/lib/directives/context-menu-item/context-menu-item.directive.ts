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
export class ContextMenuItemDirective implements Highlightable {
  @Input()
  public subMenu!: ContextMenuComponent;

  @Input()
  public divider = false;

  @Input()
  public enabled: boolean | ((item: any) => boolean) = true;

  @Input()
  public passive = false;

  @Input()
  public visible: boolean | ((item: any) => boolean) = true;

  @Output()
  public execute: EventEmitter<{
    event: MouseEvent | KeyboardEvent;
    item: any;
  }> = new EventEmitter();

  public item: any;

  public isActive = false;

  public get disabled() {
    return (
      this.passive ||
      this.divider ||
      !evaluateIfFunction(this.enabled, this.item)
    );
  }

  constructor(
    @Optional()
    public template: TemplateRef<{ item: any }>
  ) {}

  public setActiveStyles(): void {
    this.isActive = true;
  }

  public setInactiveStyles(): void {
    this.isActive = false;
  }

  public triggerExecute(item: any, $event: MouseEvent | KeyboardEvent): void {
    if (!evaluateIfFunction(this.enabled, item)) {
      return;
    }

    this.execute.emit({ event: $event, item });
  }
}
