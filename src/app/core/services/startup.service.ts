import { inject, Injectable } from '@angular/core';
import { HydrationService } from './hydration.service';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { environment } from '../../../environments/environment';
import { theData } from '../../../mocks/mockdataForHydration';
import { Author, Folio } from '../models/interfaces';
import { dataMH } from '../../../mocks/mockdataMH';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  hydrationService = inject(HydrationService);
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);

  async load(): Promise<void> {
    if (environment.ianConfig.showLogs) console.log('StartupService load');
    if (environment.ianConfig.showLogs) console.log(this.authorStore.authorLoggedIn().name);
    await this.hydrationService.hydrateFolios(this.authorStore.authorLoggedIn().id, theData);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(200);
    await this.hydrationService.hydrateSlates();
    await this.loadData2();
  }

  async loadData2() {
    const authorStartup: Author = dataMH.author;

    this.authorStore.authorCreate(authorStartup);
    const folioDefault: Folio = {
      id: 0,
      authorId: authorStartup.id,
      folioName: '@' + authorStartup.name,
      parentFolioId: undefined,
    };
    await this.folioStore.folioCreateForNewAuthor(folioDefault);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000);
    if (environment.ianConfig.showLogs) console.log(this.folioStore.folios());
    const theTopFolio = this.folioStore.folios().find(f => f.authorId === authorStartup.id && f.parentFolioId === undefined);
    if (environment.ianConfig.showLogs) console.log(theTopFolio);
    if (theTopFolio) await this.hydrationService.hydrateFolios(theTopFolio.authorId!, dataMH);
    else alert('No top folio found');
    await delay(200);
    await this.hydrationService.hydrateSlates();
  }
}
