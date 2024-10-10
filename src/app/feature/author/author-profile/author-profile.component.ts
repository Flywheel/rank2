import { Component, computed, inject, signal } from '@angular/core';
import { AuthorStore } from '../author.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconTimelineComponent } from '../../../core/svg/icon-timeline';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthorConsentComponent } from '../author-consent/author-consent.component';
import { environment } from '../../../../environments/environment';
import { Author, Folio } from '../../../core/models/interfaces';
// import { uuidv7 } from 'uuidv7';
import { AUTHOR_DEFAULT_NAME } from '../../../core/models/constants';
import { AuthorService } from '../author.service';
import { FolioStore } from '../../folio/folio.store';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, IconTimelineComponent, AuthorConsentComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
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
    const loggedInAuthorData = this.authorStore.authorLoggedIn();
    if (environment.ianConfig.showLogs) console.log(loggedInAuthorData);
    this.authorStore.authorById(loggedInAuthorData.id);
    if (environment.ianConfig.showLogs) {
      console.log(loggedInAuthorData);
      console.log(this.authorStore.authorLoggedIn());
      console.log(loggedInAuthorData.id, this.channelName());
    }
    //  this.authorStore.authorLoggedInUpdate(loggedInAuthorData.id, { name: 'this.channelName()' });
  }

  initializeAuthorHandle() {
    const currentAuthor = this.authorStore.authorLoggedIn();
    const updatedAuthorData: Author = { id: currentAuthor.id, name: this.channelName() };
    this.authorStore.authorLoggedInUpdate(currentAuthor.id, updatedAuthorData);
    const newFolio: Folio = {
      id: 0,
      authorId: currentAuthor.id,
      folioName: '@' + this.channelName(),
    };
    this.folioStore.folioCreateForNewAuthor(newFolio);
    if (environment.ianConfig.showLogs) {
      console.log(currentAuthor);
      console.log(updatedAuthorData);
      console.log(newFolio);
    }
  }

  db = inject(AuthorService);
  test3(theId: string) {
    this.db.authorsGetAll().subscribe(data => {
      console.log(data);
    });
    this.db.authorGetById(theId).subscribe(data => {
      console.log(data);
    });
  }
}
