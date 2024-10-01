import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IconCommunityComponent } from '../svg/icon-community';
import { IconMhComponent } from '../svg/icon-mh';
import { IconShareComponent } from '../svg/icon-share';
import { IconProfileComponent } from '../svg/icon-profile';
import { AuthorConsentComponent } from '../../feature/author/author-consent/author-consent.component';
import { AuthorStore } from '../../feature/author/author.store';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'mh5-header',
  standalone: true,
  imports: [IconCommunityComponent, IconMhComponent, IconShareComponent, IconProfileComponent, AuthorConsentComponent],
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

  // openFolioPage() {
  //   this.router.navigate(['/folio']);
  // }
  // openContestPage() {
  //   this.router.navigate(['/contest']);
  // }
  // openAuthorPage() {
  //   this.router.navigate(['/author']);
  // }

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
