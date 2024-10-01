import { Component, inject, input, OnInit, output } from '@angular/core';
import { AuthorStore } from '../author.store';
import { COOKIE_NAME } from '../../../core/interfaces/constants';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-author-consent',
  standalone: true,
  imports: [],
  templateUrl: './author-consent.component.html',
  styleUrl: './author-consent.component.scss',
})
export class AuthorConsentComponent implements OnInit {
  showConsentPopup = true;
  forcePopup = input<boolean>(false);
  authorStore = inject(AuthorStore);
  closeComponent = output<boolean>();

  ngOnInit(): void {
    if (environment.ianConfig.showLogs) console.log('AuthorConsentComponent ngOnInit');
    this.checkAuthorConsent();
  }

  checkAuthorConsent(): void {
    const consent = localStorage.getItem(COOKIE_NAME);
    if (consent && this.forcePopup() === false) {
      this.showConsentPopup = false;
    }
  }

  acceptCookies(): void {
    this.setIt('accepted');
  }

  declineCookies(): void {
    this.setIt('declined');
  }

  private setIt(setting: string) {
    localStorage.setItem(COOKIE_NAME, setting);
    this.authorStore.setConsentState(setting);
    this.showConsentPopup = false;
    this.closeComponent.emit(false);
  }
}
