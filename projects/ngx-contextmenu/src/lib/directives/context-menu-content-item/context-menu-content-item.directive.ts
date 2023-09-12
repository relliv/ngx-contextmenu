import { FocusOrigin, FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, Input } from '@angular/core';
import { evaluateIfFunction } from '../../helper/evaluate';
import { ContextMenuItemDirective } from '../context-menu-item/context-menu-item.directive';

@Directive({
  selector: '[contextMenuContentItem]',
  exportAs: 'contextMenuContentItem',
  host: {
    class: 'ngx-context-menu-item',
  },
})
export class ContextMenuContentItemDirective<T> implements FocusableOption {
  @Input()
  public contextMenuContentItem?: ContextMenuItemDirective<T>;

  public get nativeElement() {
    return this.elementRef.nativeElement;
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  /**
   * @implements FocusableOption
   */
  public focus(origin?: FocusOrigin | undefined): void {
    console.log('Focus', this.elementRef.nativeElement);
    this.elementRef.nativeElement.focus();
  }

  /**
   * @implements FocusableOption
   */
  public get disabled(): boolean | undefined {
    return evaluateIfFunction(
      this.contextMenuContentItem?.disabled,
      this.contextMenuContentItem?.value
    );
  }
}
