import { Component } from '@angular/core';

@Component({
  selector: 'mh5-icon-play-triangle',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24">
      <!-- Outline triangle pointing to the right -->
      <path d="M8 5 L8 19 L19 12 Z" fill="none" stroke="#CCF" stroke-width="2" />
      <!-- Outline circle inside the triangle -->
      <circle cx="12" cy="12" r="4" fill="none" stroke="#CCF" stroke-width="2" />
    </svg>
  `,
})
export class IconPlayTriangleComponent {}
