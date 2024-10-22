import { Component, computed, inject } from '@angular/core';

import { ContestService } from '../contest.service';
import { Pitch } from '../../../core/models/interfaces';
import { ContestStore } from '../contest.store';
import { environment } from '../../../../environments/environment';
import { FolioStore } from '../../folio/folio.store';
import { HydrationService } from '../../../core/services/hydration.service';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-direct',
  standalone: true,
  imports: [],
  templateUrl: './direct.component.html',
  styleUrl: './direct.component.scss',
})
export class DirectComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(ContestStore);
  folioStore = inject(FolioStore);
  db = inject(ContestService);
  contestObservable = computed(() => this.db.contestsGetAll());

  hydrationService = inject(HydrationService);
  isHydrated = false;
  import() {
    if (!this.isHydrated) {
      this.hydrationService.hydrateFolios();
      this.isHydrated = true;
    }

    if (environment.ianConfig.showLogs) {
      console.log(this.authorStore.folioTreeData());
    }
  }
  hydrateSlates() {
    this.hydrationService.hydrateSlates();

    this.db.contestsGetAll().subscribe(data => {
      console.log(data);
    });
  }

  test2() {
    const contest: Pitch = {
      id: 4,
      folioId: 1,
      closes: new Date(),
      opens: new Date(),
      title: 'New Title',
      description: 'New Description',
      authorId: '1',
    };
    this.db.contestUpdateName(contest.id, contest).subscribe(data => {
      console.log(data);
    });
  }

  testService() {
    this.db.addSlateMember({ id: 0, slateId: 4, placementId: 36, rankOrder: 1 }).subscribe(data => {
      console.log(data);
    });

    // this.db.slateCreate({ contestId: 4, authorId: '1', isTopSlate: true }).subscribe(data => {
    //   console.log(data);
    // });
  }
  testStore() {
    if (environment.ianConfig.showLogs) {
      console.log('Environment:', environment);
      // console.log('Asset Placement Folio Store');
      // console.log(this.folioStore.assets());
      // console.log(this.folioStore.placements());
      // console.log(this.folioStore.folios());
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

      console.log('pitchViewSelected');
      console.log(this.pitchStore.pitchViewSelected());
    }
  }
}

// test4() {
//   this.db.contestUpdateName3(4, 'New Title').subscribe(data => {
//     console.log(data);
//   });
// }
//}
