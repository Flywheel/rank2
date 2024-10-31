import { Component, inject, input, output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IconCommunityComponent } from '../../svg/icon-community';
import { IconShareComponent } from '../../svg/icon-share';
import { IconProfileComponent } from '../../svg/icon-profile';
import { AuthorConsentComponent } from '../../../feature/author/author-consent/author-consent.component';
import { IconDashboardComponent } from '../../svg/icon-dashboard';
import { IconFrameComponent } from '../../svg/icon-dashboard copy';
import { IconMhComponent } from '../../svg/icon-mh';

@Component({
  selector: 'mh5-header',
  standalone: true,
  imports: [
    IconMhComponent,
    IconCommunityComponent,
    IconShareComponent,
    IconProfileComponent,
    AuthorConsentComponent,
    IconDashboardComponent,
    IconFrameComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  router = inject(Router);
  callerPage = input.required<string>();
  location = inject(Location);

  hidePlacementDisplay = output<boolean>();

  openPage(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }
  closePlacementDisplay() {
    this.hidePlacementDisplay.emit(true);
  }
}
