import { Component, computed, inject, signal } from '@angular/core';
import { AuthorStore } from '../author.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconTimelineComponent } from '../../../core/svg/icon-timeline';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthorConsentComponent } from '../author-consent/author-consent.component';
import { environment } from '../../../../environments/environment';
import { Author } from '../../../core/interfaces/interfaces';
import { uuidv7 } from 'uuidv7';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, IconTimelineComponent, AuthorConsentComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent {
  channelName = signal<string>('');
  showConsentPopup = signal(false);
  localStorageService = inject(LocalStorageService);

  isChannelNameOk = computed<boolean>(() => this.channelName().length >= 3 && this.channelName().length <= 15);

  showConsentDialog() {
    if (environment.ianConfig.showLogs) console.log('ShowConsentDialog', this.showConsentPopup());
    this.showConsentPopup.set(true);
  }

  closeConsentDialog() {
    if (environment.ianConfig.showLogs) console.log('CloseConsentDialog', this.showConsentPopup());
    this.showConsentPopup.set(false);
    if (environment.ianConfig.showLogs) console.log('CloseConsentDialog', this.showConsentPopup());
  }

  runSomething() {
    const authorData: Author = {
      id: uuidv7(),
      name: this.channelName(),
    };
    this.authorStore.authorAdd(authorData);

    if (environment.ianConfig.showLogs) {
      console.log(this.authorStore.authorLoggedIn());
      console.log(this.authorStore.knownAuthors());
    }
    this.authorStore.authorViewByUid(this.authorStore.authorLoggedIn().id);
  }
  authorStore = inject(AuthorStore);
  isBackDoorOpen = signal<boolean>(true);

  initializeAuthorHandle() {
    const authorData: Partial<Author> = {
      name: this.channelName(),
    };
    this.authorStore.authorUpdate(authorData);
  }
}
