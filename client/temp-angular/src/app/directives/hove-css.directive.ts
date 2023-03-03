import { Directive, Input, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHoverCssClass]',
})
export class HoverCssDirective {
  @Input('appHoverCssClass') cssClass: string = '';
  @HostBinding('class') styleClass: string;

  @HostListener('mouseenter') mouseover() {
    this.styleClass = this.cssClass;
  }

  @HostListener('mouseout') mouseleave() {
    this.styleClass = '';
  }
}
