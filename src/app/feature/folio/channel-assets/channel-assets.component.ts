import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { PitchView, FolioView, PlacementView } from '../../../core/models/interfaces';
import { FolioStore } from '../folio.store';
import { ContestStore } from '../../contest/contest.store';
import { AuthorStore } from '../../author/author.store';
import { ChannelPitchesComponent } from '../channel-pitches/channel-pitches.component';

@Component({
  selector: 'mh5-channel-assets',
  standalone: true,
  imports: [ChannelPitchesComponent],
  templateUrl: './channel-assets.component.html',
  styleUrl: './channel-assets.component.scss',
})
export class ChannelAssetsComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(ContestStore);
  folioList = input<FolioView[]>([]);
  tabSelected = input<string>('');

  placementsBySelectedFolio = computed<PlacementView[]>(() => {
    return this.folioStore.folioViewSelected().placementViews ?? [];
  });

  pitchesBySelectedFolio = computed<PitchView[]>(() => {
    return this.pitchStore.allContestViews().filter(a => a.authorId === this.authorStore.authorLoggedIn().id) ?? [];
  });

  firstFolioId = computed<number>(() => this.folioList()?.[0]?.id ?? 0);

  // constructor() {
  //   effect(() => {
  //     const folioId = this.firstFolioId();
  //     if (folioId > 0) {
  //       const fv = this.folioList().filter(f => f.id === folioId)[0];
  //       untracked(() => {
  //         this.folioStore.setFolioSelected(fv.id);
  //       });
  //     }
  //   });
  // }

  selectFolioView(folio: FolioView) {
    //this.selectedFolioView.set(folio);
    this.folioStore.setFolioSelected(folio.id);
    this.pitchStore.setPitchSelected(folio.id);
  }

  displayAsset(placement: PlacementView) {
    console.log(placement.asset.mediaType);
  }
}
