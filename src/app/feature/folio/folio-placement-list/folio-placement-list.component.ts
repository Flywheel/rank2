import { Component, computed, inject } from '@angular/core';
import { FolioStore } from '../folio.store';
import { PlacementView } from '@core/models/interfaces';

@Component({
  selector: 'mh5-folio-placement-list',
  standalone: true,
  imports: [],
  templateUrl: './folio-placement-list.component.html',
  styleUrl: './folio-placement-list.component.scss',
})
export class FolioPlacementListComponent {
  folioStore = inject(FolioStore);
  folioViewSelected = computed(() => this.folioStore.folioViewSelected());
  folioViewSelectedPlacements = computed<PlacementView[]>(() => this.folioViewSelected().placementViews);
}
