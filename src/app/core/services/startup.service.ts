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
    await this.delay(200);
    await this.hydrationService.hydrateSlates(theAuthor.id);
  }

  async importMiniHeraldAssets() {
    const authorStartup: Author = miniHeraldData.author;

    await this.authorStore.authorCreate(authorStartup);
    const folioDefault: Folio = {
      id: 0,
      authorId: authorStartup.id,
      folioName: '@' + authorStartup.name,
      parentFolioId: undefined,
    };
    await this.folioStore.folioCreateForNewAuthor(folioDefault);

    await this.delay(1000);
    const theTopFolio = this.folioStore.folios().find(f => f.authorId === authorStartup.id && f.parentFolioId === undefined);
    if (theTopFolio) await this.hydrationService.hydrateFolios(theTopFolio.authorId!, miniHeraldData);
    else alert('No top folio found');
    await this.delay(200);
    await this.hydrationService.hydrateSlates(folioDefault.authorId);
  }
}