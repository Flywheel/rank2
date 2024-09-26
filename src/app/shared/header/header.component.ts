import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IconCommunityComponent } from './svg/icon-community';
import { IconMhComponent } from './svg/icon-mh';
import { IconShareComponent } from './svg/icon-share';

@Component({
  selector: 'mh5-header',
  standalone: true,
  imports: [IconCommunityComponent, IconMhComponent, IconShareComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  callerPage = input.required<string>();

  openFolioPage() {
    this.router.navigate(['/folio']);
  }
  openContestPage() {
    this.router.navigate(['/contest']);
  }
}
