import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[mh5SwipeRight]',
})
export class SwipeRightDirective {
  @Output() swipeRightDetected = new EventEmitter<void>();

  private touchStartX = 0;
  private touchEndX = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    if (this.touchEndX > this.touchStartX + 20) {
      this.swipeRightDetected.emit();
    }
  }
}
// export class SwipeRightDirective implements OnInit, OnDestroy {
//   @Input() swipeThreshold = 50;

//   @Output() swipeRightDetected = new EventEmitter<void>();

//   private startX = 0;

//   private pointerDownListener = (event: PointerEvent) => this.onPointerDown(event);
//   private pointerUpListener = (event: PointerEvent) => this.onPointerUp(event);

//   constructor(private el: ElementRef<HTMLElement>) {}

//   ngOnInit(): void {
//     this.el.nativeElement.addEventListener('pointerdown', this.pointerDownListener);
//     this.el.nativeElement.addEventListener('pointerup', this.pointerUpListener);
//   }

//   ngOnDestroy(): void {
//     this.el.nativeElement.removeEventListener('pointerdown', this.pointerDownListener);
//     this.el.nativeElement.removeEventListener('pointerup', this.pointerUpListener);
//   }

//   private onPointerDown(event: PointerEvent): void {
//     this.startX = event.clientX;
//   }

//   private onPointerUp(event: PointerEvent): void {
//     const deltaX = event.clientX - this.startX;
//     if (deltaX > this.swipeThreshold) {
//       this.swipeRightDetected.emit();
//     }
//   }
// }
