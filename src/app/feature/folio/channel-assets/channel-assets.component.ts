import { Component, computed, effect, inject, input, OnInit, signal, untracked } from '@angular/core';
import { FolioView, PlacementView } from '../../../core/models/interfaces';
import { FolioStore } from '../folio.store';

@Component({
  selector: 'mh5-channel-assets',
  standalone: true,
  imports: [],
  templateUrl: './channel-assets.component.html',
  styleUrl: './channel-assets.component.scss',
})
export class ChannelAssetsComponent {
  folioStore = inject(FolioStore);
  folioList = input<FolioView[]>([]);

  selectedFolioView = signal<FolioView>({} as FolioView);

  placementsBySelectedFolio = computed<PlacementView[]>(() => {
    return this.selectedFolioView().placementViews ?? [];
  });

  firstFolioId = computed<number>(() => this.folioList()?.[0]?.id ?? 0);

  constructor() {
    effect(() => {
      const folioId = this.firstFolioId();
      if (folioId > 0) {
        const xx = this.folioList().filter(f => f.id === folioId)[0];
        untracked(() => this.selectedFolioView.set(xx));
      }
    });
  }

  displayAsset(placement: PlacementView) {
    console.log(placement.asset.mediaType);
  }

  save() {
    this.folioStore.folioStateToLocalStorage();
  }
}
