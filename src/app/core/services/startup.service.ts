import { inject, Injectable } from '@angular/core';
import { HydrationService } from './hydration.service';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { theData } from '../../../mocks/mockdataForHydration';
import { Author, DataImporter, Folio } from '../models/interfaces';
import { miniHeraldData } from '../../../mocks/mockdataMH';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  hydrationService = inject(HydrationService);
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);

  async importAuthorLoggedInAssets(): Promise<void> {
    const theAuthor = this.authorStore.authorLoggedIn();
    await this.hydrationService.hydrateFolios(theAuthor.id, theData as DataImporter);
    await this.delay(100);
    await this.hydrationService.hydrateSlates(theAuthor.id);
  }

  async importMiniHeraldAssets() {
    await this.importAssets(miniHeraldData);
  }

  async importAssets(data: DataImporter) {
    const authorStartup: Author = data.author;

    await this.authorStore.createAuthor(authorStartup, false);
    const folioDefault: Folio = {
      id: 0,
      authorId: authorStartup.id,
      folioName: '@' + authorStartup.name,
      parentFolioId: undefined,
    };
    await this.folioStore.createRootFolio(folioDefault);

    await this.delay(100);
    const theTopFolio = this.folioStore.folios().find(f => f.authorId === authorStartup.id && f.parentFolioId === undefined);
    if (theTopFolio) await this.hydrationService.hydrateFolios(theTopFolio.authorId!, data);
    else alert('No top folio found');
    await this.delay(100);
    await this.hydrationService.hydrateSlates(folioDefault.authorId);
  }
}

// async importMiniHeraldAssets1() {
//   const authorStartup: Author = miniHeraldData.author;

//   await this.authorStore.createAuthor(authorStartup, false);
//   const folioDefault: Folio = {
//     id: 0,
//     authorId: authorStartup.id,
//     folioName: '@' + authorStartup.name,
//     parentFolioId: undefined,
//   };
//   await this.folioStore.createFolioAsRoot(folioDefault);

//   await this.delay(100);
//   const theTopFolio = this.folioStore.folios().find(f => f.authorId === authorStartup.id && f.parentFolioId === undefined);
//   if (theTopFolio) await this.hydrationService.hydrateFolios(theTopFolio.authorId!, miniHeraldData);
//   else alert('No top folio found');
//   await this.delay(100);
//   await this.hydrationService.hydrateSlates(folioDefault.authorId);
// }
