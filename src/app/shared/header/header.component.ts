import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityComponent } from './svg/icon-community';

@Component({
  selector: 'mh5-header',
  standalone: true,
  imports: [CommunityComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  openFolioPage() {
    this.router.navigate(['/folio']);
  }
}
