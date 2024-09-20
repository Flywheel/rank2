import { Component, computed, inject, signal } from '@angular/core';
import { FolioStore } from '../folio.store';
import { PlacementView } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'mh5-folio-placement-list',
  standalone: true,
  imports: [],
  templateUrl: './folio-placement-list.component.html',
  styleUrl: './folio-placement-list.component.scss',
})
export class FolioPlacementListComponent {
  authorId = signal<number>(1);
  folioStore = inject(FolioStore);
  // folio = computed<FolioView>(() => this.folioStore.currentFolioView());
  // placements = computed(() => this.folio().placementViews);

  placements2 = computed<PlacementView[]>(() => this.folioStore.currentFolioView().placementViews);
}
