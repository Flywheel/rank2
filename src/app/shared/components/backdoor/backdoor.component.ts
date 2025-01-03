import { Component, computed, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MockDataService } from '@shared/services/mock-data.service';
import { AuthorStore } from '@feature/author/author.store';
import { BallotStore } from '@feature/ballot/ballot.store';
import { FolioStore } from '@feature/folio/folio.store';
import { PitchService } from '@feature/pitch/pitch.service';
import { PitchStore } from '@feature/pitch/pitch.store';
import { HydrationService } from '@shared/services/hydration.service';
import { slateMemberInit } from '@shared/models/initValues';
import { SlateMember } from '@shared/models/interfaces';
import { AuthorService } from '@feature/author/author.service';

@Component({
  selector: 'mh5-backdoor',
  standalone: true,
  imports: [],
  templateUrl: './backdoor.component.html',
  styleUrl: './backdoor.component.scss',
})
export class BackdoorComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(PitchStore);
  ballotStore = inject(BallotStore);
  startupService = inject(MockDataService);

  authorService = inject(AuthorService);
  pitchService = inject(PitchService);
  hydrationService = inject(HydrationService);

  isHydrated = false;

  import() {
    this.startupService.importAuthorLoggedInAssets();
  }

  thePitches = computed(() => this.pitchStore.pitchesViaRxMethod());
  pitchrx() {
    this.pitchStore.loadPitchByIdViaRxMethod(this.pitchStore.pitchIdSelected());
    console.log(this.pitchStore.pitchesViaRxMethod());
  }

  theSlates = computed(() => this.pitchStore.slateMembers().sort((a: SlateMember, b: SlateMember) => b.id - a.id));

  slateRx() {
    this.pitchStore.addSlateMembers([slateMemberInit]);
    // const slateMembers = [slateMemberInit];
    //  const x =  this.pitchStore.rxSLateMaker(slateMembers);s
    // this.pitchStore.addSlateMembersRX(slateMembers).subscribe({
    //   next: newMembers => {
    //     console.log('New members added:', newMembers);
    //   },
    //   error: err => {
    //     console.error('Error adding members:', err);
    //   }
    // });
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
    const loggedInAuthorId = this.authorStore.authorLoggedIn().id;
    this.authorService.authorGetById(loggedInAuthorId).subscribe(data => {
      console.log(data);
    });
    this.authorService.authorsGetAll().subscribe(data => {
      console.log(data);
    });

    // this.pitchService.contestsGetAll().subscribe(data => {
    //   console.log(data);
    // });

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
