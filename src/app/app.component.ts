import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorStore } from './feature/author/author.store';
import { AUTHOR_CONSENT_KEY, AUTHOR_DEFAULT_NAME, AUTHOR_HOST_NAME } from './core/models/constants';
import { AuthorConsentComponent } from './feature/author/author-consent/author-consent.component';
import { CommonModule } from '@angular/common';
import { delay, Subject } from 'rxjs';
import { FolioStore } from './feature/folio/folio.store';
import { Folio } from './core/models/interfaces';
import { SwUpdate } from '@angular/service-worker';
import { StartupService } from './core/services/startup.service';

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
  startupService = inject(StartupService);
  swUpdate = inject(SwUpdate);
  title = AUTHOR_HOST_NAME;
  isIframe = false;

  private readonly _destroying$ = new Subject<void>();

  constructor() {
    this.onLoad();
  }

  ngOnInit(): void {
    this.reloadCache();
    if (typeof window !== 'undefined') {
      this.isIframe = window !== window.parent && !window.opener;
    }
  }

  async onLoad() {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem(AUTHOR_CONSENT_KEY);
      if (consent) {
        this.authorStore.getConsentValueFromLocalStorage(consent);
        if (consent === 'accepted') {
          await this.loadForDemo_NoBackend();
        }
      }
    }
  }

  reloadCache(): void {
    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        window.location.reload();
      }
    });
  }

  private async loadForDemo_NoBackend() {
    const loggedInAuthorId = this.authorStore.authorLoggedIn().id;
    //    const author2 = await this.authorStore.selectedAuthorByIdAsync(loggedInAuthorId);
    const author = this.authorStore.authorSelectedSetById(loggedInAuthorId);

    console.log(this.authorStore.authorLoggedIn());
    console.log(author);
    //   console.log(author2);
    if (!author) {
      await this.authorStore.createAuthor(author, false);
      await this.authorStore.loginAuthor(author);
    }
    if (this.authorStore.authorLoggedIn().name !== AUTHOR_DEFAULT_NAME) {
      const folioDefault: Folio = {
        id: 0,
        authorId: loggedInAuthorId,
        folioName: '@' + this.authorStore.authorLoggedIn().name,
        parentFolioId: undefined,
      };
      console.log(folioDefault);
      await this.folioStore.createFolioAsRoot(folioDefault);
      delay(100);
      console.log(this.folioStore.folios());
    }
    await this.startupService.importMiniHeraldAssets();
    await this.startupService.importAuthorLoggedInAssets();
    this.authorStore.setStartupCompleted();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
