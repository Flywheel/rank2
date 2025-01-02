import { Component, inject } from '@angular/core';
import { ShareService } from '@shared/services/share.service';

@Component({
  selector: 'mh5-icon-share',
  standalone: true,
  imports: [],
  template: `
    <span (click)="share()" (keydown)="share()" tabindex="1">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#CCF">
        <path
          d="M240-40q-33 0-56.5-23.5T160-120v-440q0-33 23.5-56.5T240-640h120v80H240v440h480v-440H600v-80h120q33 0 56.5 23.5T800-560v440q0 33-23.5 56.5T720-40H240Zm200-280v-447l-64 64-56-57 160-160 160 160-56 57-64-64v447h-80Z" />
      </svg>
    </span>
  `,
  styles: '',
})
export class IconShareComponent {
  shareService = inject(ShareService);

  async share() {
    this.shareService.share(
      'Hi!  Mini Herald is a new kind of ranked choice straw poll. Interested in beta testing? Sign up here:  ',
      `https://mh5.netlify.app/`
    );
  }
}
