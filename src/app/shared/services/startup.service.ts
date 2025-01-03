import { inject, Injectable } from '@angular/core';
import { delay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorStore } from '@feature/author/author.store';
import { FolioStore } from '@feature/folio/folio.store';
import { AUTHOR_DEFAULT_NAME } from '@shared/models/constants';
import { Folio } from '@shared/models/interfaces';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  mockDataService = inject(MockDataService);

  async loadAuthorForDemo() {
    const loggedInAuthorId = this.authorStore.authorLoggedIn().id;
    let author = this.authorStore.authorSelectedSetById(loggedInAuthorId);

    if (environment.ianConfig.showLogs) {
      console.log(this.authorStore.authorLoggedIn());
      author
        .then(a => {
          if (a) {
            console.log(a);
          } else {
            console.log('Author or author name is undefined');
          }
        })
        .catch(error => {
          console.error('Error fetching author:', error);
        });
    }
    if (!author) {
      await this.authorStore.createAuthor(author, false);
      await this.authorStore.loginAuthor(author);
      author = this.authorStore.authorSelectedSetById(loggedInAuthorId);
    }

    if (this.authorStore.authorLoggedIn().name !== AUTHOR_DEFAULT_NAME) {
      const folioDefault: Folio = {
        id: 0,
        authorId: loggedInAuthorId,
        folioName: '@' + this.authorStore.authorLoggedIn().name,
        parentFolioId: undefined,
      };
      console.log(folioDefault);
      await this.folioStore.createRootFolio(folioDefault);

      delay(100);
      console.log(this.folioStore.folios());
    }
    console.log(this.folioStore.folios());

    await this.mockDataService.importAuthorLoggedInAssets();
  }

  async loadMH5DemoData() {
    await this.mockDataService.importMiniHeraldAssets();
  }
}
