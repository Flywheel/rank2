import { inject, Injectable } from '@angular/core';
import { HydrationService } from './hydration.service';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  hydrationService = inject(HydrationService);
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);

  load(): void {
    if (environment.ianConfig.showLogs) console.log('StartupService load');
    if (environment.ianConfig.showLogs) console.log(this.authorStore.authorLoggedIn().name);
    // const authorStartup: Author = {
    //   name: 'Ian',
    //   id: 'xxxx---xxxx---xxxx---xxxx',
    // };
    // this.authorStore.authorCreate(authorStartup);
    // //  this.authorStore.authorLogin(authorStartup);

    // const folioDefault: Folio = {
    //   id: 0,
    //   authorId: authorStartup.id,
    //   folioName: '@' + authorStartup.name,
    //   parentFolioId: undefined,
    // };
    // this.folioStore.folioCreateForNewAuthor(folioDefault);
    // this.hydrationService.hydrateFolios(authorStartup.id);
  }
}
