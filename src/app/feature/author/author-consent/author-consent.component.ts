import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
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
  authorStore = inject(AuthorStore);
  forcePopup = input<boolean>(false);
  consentValue = signal<string | null>('');
  showConsentPopup = computed<boolean>(() => this.consentValue() === null || this.forcePopup());
  closeComponent = output<boolean>();

  ngOnInit(): void {
    if (environment.ianConfig.showLogs) console.log('AuthorConsentComponent ngOnInit');
    this.checkAuthorConsent();
  }

  checkAuthorConsent(): void {
    this.consentValue.set(localStorage.getItem(AUTHOR_CONSENT_KEY));
  }

  acceptCookies(): void {
    this.authorStore.authorAdd({ id: uuidv7(), name: '' });
    this.setIt('accepted');
  }

  declineCookies(): void {
    this.setIt('declined');
  }

  private setIt(setting: string) {
    localStorage.setItem(AUTHOR_CONSENT_KEY, setting);
    this.authorStore.setConsent(setting);
    this.consentValue.set(setting);
    this.closeComponent.emit(false);
  }
}
