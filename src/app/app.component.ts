import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorStore } from '@feature/author/author.store';
import { AUTHOR_CONSENT_KEY, AUTHOR_HOST_NAME } from '@core/models/constants';
import { AuthorConsentComponent } from '@feature/author/author-consent/author-consent.component';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { StartupService } from '@core/services/startup.service';

@Component({
  selector: 'mh5-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AuthorConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  authorStore = inject(AuthorStore);
  //folioStore = inject(FolioStore);
  startupService = inject(StartupService);

  swUpdate = inject(SwUpdate);
  title = AUTHOR_HOST_NAME;
  isIframe = false;

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    this.reloadCache();
    if (typeof window !== 'undefined') {
      this.isIframe = window !== window.parent && !window.opener;
      this.onLoad();
    }
  }

  async onLoad() {
    await this.startupService.loadMH5();
    const consent = localStorage.getItem(AUTHOR_CONSENT_KEY);
    console.log(consent);
    if (consent) {
      await this.authorStore.getConsentValueFromLocalStorage(consent);
      if (consent === 'accepted') {
        await this.startupService.loadForDemo();
        this.authorStore.setStartupCompleted();
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

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
