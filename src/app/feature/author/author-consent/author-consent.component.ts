import { Component, inject, input, OnInit, output } from '@angular/core';
import { AuthorStore } from '../author.store';
import { AUTHOR_CONSENT_KEY } from '../../../core/interfaces/constants';
import { environment } from '../../../../environments/environment';
import { uuidv7 } from 'uuidv7';

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
    const consent = localStorage.getItem(AUTHOR_CONSENT_KEY);
    if (consent && this.forcePopup() === false) {
      this.showConsentPopup = false;
    }
  }

  acceptCookies(): void {
    this.setIt('accepted');
    this.authorStore.authorAdd({ id: uuidv7(), name: '', authenticatorId: 'ZZZ', eventLog: [] });
  }

  declineCookies(): void {
    this.setIt('declined');
  }

  private setIt(setting: string) {
    localStorage.setItem(AUTHOR_CONSENT_KEY, setting);
    this.authorStore.setConsent(setting);
    this.showConsentPopup = false;
    this.closeComponent.emit(false);
  }
}
