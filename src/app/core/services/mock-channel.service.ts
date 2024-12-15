import { inject, Injectable } from '@angular/core';
import { delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { AUTHOR_DEFAULT_NAME } from '../models/constants';
import { Folio } from '../models/interfaces';
import { StartupService } from './startup.service';

@Injectable({
  providedIn: 'root',
})
export class MockChannelService {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  startupService = inject(StartupService);

  async loadForDemo_NoBackend() {
    const loggedInAuthorId = this.authorStore.authorLoggedIn().id;
    const author = this.authorStore.authorSelectedSetById(loggedInAuthorId);

    if (environment.ianConfig.showLogs) {
      console.log(this.authorStore.authorLoggedIn());
      console.log(author);
    }
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
    console.log(this.folioStore.folios());
    await this.startupService.importMiniHeraldAssets();
    await this.startupService.importAuthorLoggedInAssets();
    this.authorStore.setStartupCompleted();
  }
}
