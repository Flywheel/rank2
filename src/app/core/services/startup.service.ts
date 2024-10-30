import { inject, Injectable } from '@angular/core';
import { HydrationService } from './hydration.service';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { environment } from '../../../environments/environment';
import { theData } from '../../../mocks/mockdataForHydration';

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
  }
}
