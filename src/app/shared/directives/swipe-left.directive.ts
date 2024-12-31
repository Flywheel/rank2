import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[mh5SwipeLeft]',
  standalone: true,
})
export class SwipeLeftDirective {
  @Output() swipeLeftDetected = new EventEmitter<void>();

  private touchStartX = 0;
  private touchEndX = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    console.log('touchstart');
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    if (this.touchEndX > this.touchStartX + 20) {
      this.swipeLeftDetected.emit();
    }
  }
}
