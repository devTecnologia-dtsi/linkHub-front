import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appLimitChars]',
  standalone: true,
})
export class LimitCharsDirective {
  @Input('appLimitChars') maxChars = 100;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const element = this.el.nativeElement as
      | HTMLInputElement
      | HTMLTextAreaElement;

    if (
      element.tagName.toLowerCase() === 'input' ||
      element.tagName.toLowerCase() === 'textarea'
    ) {
      this.renderer.setAttribute(element, 'maxlength', String(this.maxChars));
    }
  }

  @HostListener('input') onInput() {
    this.enforceLimit();
  }

  private enforceLimit() {
    const element = this.el.nativeElement as
      | HTMLInputElement
      | HTMLTextAreaElement;
    if (element.value.length > this.maxChars) {
      element.value = element.value.slice(0, this.maxChars);
      const evt = new Event('input', { bubbles: true });
      element.dispatchEvent(evt); // notifica a Angular Forms
    }
  }
}
