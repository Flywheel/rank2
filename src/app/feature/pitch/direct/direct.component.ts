import { Component, computed, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { AuthorStore } from '../../author/author.store';
import { FolioStore } from '../../folio/folio.store';
import { PitchStore } from '../pitch.store';

import { PitchService } from '../pitch.service';
import { HydrationService } from '../../../core/services/hydration.service';
import { BallotStore } from '../../ballot/ballot.store';
import { AUTHOR_DEFAULT_NAME } from '../../../core/models/constants';
import { theData } from '../../../../mocks/mockdataForHydration';
import { DataImporter } from '../../../core/models/interfaces';
import { StartupService } from '../../../core/services/startup.service';

@Component({
  selector: 'mh5-direct',
  standalone: true,
  imports: [],
  templateUrl: './direct.component.html',
  styleUrl: './direct.component.scss',
})
export class DirectComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(PitchStore);
  ballotStore = inject(BallotStore);
  startupService = inject(StartupService);

  pitchService = inject(PitchService);
  hydrationService = inject(HydrationService);

  needsAuthorName = computed<boolean>(() => this.authorStore.authorLoggedIn().name === AUTHOR_DEFAULT_NAME);
  isHydrated = false;

  import() {
    this.startupService.importAuthorLoggedInAssets();
  }

  // private async loadData() {
  //   if (!this.isHydrated) {
  //     await this.hydrationService.hydrateFolios(this.authorStore.authorLoggedIn().id, theData as DataImporter);
  //     this.isHydrated = true;
  //     const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  //     await delay(200);
  //     await this.hydrationService.hydrateSlates();
  //   }
  // }
  // hydrateSlates() {
  //   this.hydrationService.hydrateSlates();
  // }

  testService() {
    //#region Read
    // this.pitchService.contestsGetAll().subscribe(data => {
    //   console.log(data);
    // });
    //#endregion Read
    //#region Create
    // const contest: Pitch = {
    //   id: 4,
    //   folioId: 1,
    //   closes: new Date(),
    //   opens: new Date(),
    //   title: 'New Title',
    //   description: 'New Description',
    //   authorId: '1',
    // };
    // this.db.contestUpdateName(contest.id, contest).subscribe(data => {
    //   console.log(data);
    // });
    // this.db.addSlateMember({ id: 0, slateId: 4, placementId: 36, rankOrder: 1 }).subscribe(data => {
    //   console.log(data);
    // });
    // this.db.slateCreate({ contestId: 4, authorId: '1', isTopSlate: true }).subscribe(data => {
    //   console.log(data);
    // });
    //#endregion Create
  }

  async storeLogs(): Promise<void> {
    if (environment.ianConfig.showLogs) {
      console.log(this.authorStore.authorFolioTree());
      console.log('Environment:', environment);

      console.log('Asset Placement Folio Store');
      console.log(this.folioStore.assets());
      console.log(this.folioStore.placements());
      console.log(this.folioStore.folios());

      console.log('Asset Placement Folio Computed');
      console.log(this.folioStore.assetViewsComputed());
      console.log(this.folioStore.placementViewsComputed());
      console.log(this.folioStore.folioViewsComputed());

      console.log('SlateMember-Slate-Pitch : Stores');
      console.log(this.pitchStore.slateMembers());
      console.log(this.pitchStore.slates());
      console.log(this.pitchStore.pitches());

      console.log('SlateMember-Slate-Pitch : Computed Views');
      console.log(this.pitchStore.slateMemberViewsComputed());
      console.log(this.pitchStore.slateViewsComputed());
      console.log(this.pitchStore.pitchViewsComputed());

      console.log('Author: Store View');
      console.log(this.authorStore.authors());
      console.log(this.authorStore.authorViews());
      //   console.log(this.authorStore.authorViews2());

      console.log('pitchViewSelected');
      console.log(this.pitchStore.pitchViewSelected());
    }
  }
}
