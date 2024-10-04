import { Component, computed, inject, input, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IconCommunityComponent } from '../svg/icon-community';
import { IconMhComponent } from '../svg/icon-mh';
import { IconShareComponent } from '../svg/icon-share';
import { IconProfileComponent } from '../svg/icon-profile';
import { AuthorConsentComponent } from '../../feature/author/author-consent/author-consent.component';
import { AuthorStore } from '../../feature/author/author.store';
import { IconDashboardComponent } from '../svg/icon-dashboard';
import { IconFrameComponent } from '../svg/icon-dashboard copy';

@Component({
  selector: 'mh5-header',
  standalone: true,
  imports: [
    IconCommunityComponent,
    IconMhComponent,
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
  authorStore = inject(AuthorStore);
  callerPage = input.required<string>();
  location = inject(Location);
  isCookieStatusAccepted = computed<boolean>(() => this.authorStore.consentStatus() === 'accepted');
  showCookieConsentComponent = signal(false);

  openPage(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }

  closeCookieComponent() {
    console.log('closeCookieComponent Fired');
    this.showCookieConsentComponent.set(false);
  }
}
