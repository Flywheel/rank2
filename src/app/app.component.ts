import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorStore } from './feature/author/author.store';
import { AUTHOR_CONSENT_KEY, AUTHOR_DEFAULT_NAME } from './core/interfaces/constants';
import { AuthorConsentComponent } from './feature/author/author-consent/author-consent.component';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { FolioStore } from './feature/folio/folio.store';
import { Folio } from './core/interfaces/interfaces';

@Component({
  selector: 'mh5-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AuthorConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  // swUpdate = inject(SwUpdate);
  title = 'MH - rank2';
  isIframe = false;

  private readonly _destroying$ = new Subject<void>();
  constructor() {
    this.onLoad();
  }

  ngOnInit(): void {
    // this.reloadCache();
    if (typeof window !== 'undefined') {
      this.isIframe = window !== window.parent && !window.opener;
    }
  }
  async onLoad() {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem(AUTHOR_CONSENT_KEY);
      if (consent) {
        this.authorStore.setConsent(consent);
        if (consent === 'accepted') {
          this.loadForDemo_NoBackend();
        }
      }
    }
  }

  private loadForDemo_NoBackend() {
    const authorId = this.authorStore.authorLoggedIn().id;
    const author = this.authorStore.authorById(authorId);
    if (!author) {
      this.authorStore.authorCreate(author);
    }
    if (this.authorStore.authorLoggedIn().name !== AUTHOR_DEFAULT_NAME) {
      const folioDefault: Folio = {
        id: 0,
        authorId: authorId,
        folioName: '@' + this.authorStore.authorLoggedIn().name,
        isDefault: true,
        parentFolioId: undefined,
      };
      this.folioStore.folioCreateForNewAuthor(folioDefault);
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
