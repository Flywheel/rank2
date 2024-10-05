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
import { AUTHOR_DEFAULT_NAME } from '../../../core/interfaces/constants';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, IconTimelineComponent, AuthorConsentComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent {
  authorStore = inject(AuthorStore);
  isRunSomethingVisible = signal<boolean>(true);
  channelName = signal<string>('');
  showConsentPopup = signal(false);
  localStorageService = inject(LocalStorageService);
  authorDefaultName = AUTHOR_DEFAULT_NAME;

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
    // const authorData: Author = {
    //   id: uuidv7(),
    //   name: this.channelName(),
    // };
    // this.authorStore.authorAdd(authorData);

    // if (environment.ianConfig.showLogs) {
    //   console.log(this.authorStore.authorLoggedIn());
    //   console.log(this.authorStore.knownAuthors());
    // }
    const xx = this.authorStore.authorLoggedIn();
    if (environment.ianConfig.showLogs) console.log(xx);

    this.authorStore.authorViewByUid(this.authorStore.authorLoggedIn().id);
  }

  initializeAuthorHandle() {
    const currentAuthor = this.authorStore.authorLoggedIn();
    if (environment.ianConfig.showLogs) console.log(currentAuthor);
    const updatedAuthorData: Partial<Author> = { name: this.channelName() };

    if (environment.ianConfig.showLogs) console.log(currentAuthor.id, updatedAuthorData);
    this.authorStore.authorLoggedInUpdate(currentAuthor.id, updatedAuthorData);
  }
}