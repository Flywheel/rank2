import { Component, inject, input, output } from '@angular/core';
import { FolioStore } from '../folio.store';
import { Folio } from '../../../core/interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { IconPlusComponent } from '../../../core/svg/icon-plus';
import { IconProfileComponent } from '../../../core/svg/icon-profile';
import { IconShareComponent } from '../../../core/svg/icon-share';

@Component({
  selector: 'mh5-folio-scroll-horizontal',
  standalone: true,
  imports: [IconPlusComponent, IconProfileComponent, IconShareComponent],
  templateUrl: './folio-scroll-horizontal.component.html',
  styleUrl: './folio-scroll-horizontal.component.scss',
})
export class FolioScrollHorizontalComponent {
  folioStore = inject(FolioStore);
  theFoliosInput = input<Folio[]>();
  newFolioEditorStateChange = output<boolean>();
  newPlacementEditorStateChange = output<boolean>();

  selectFolio(id: number) {
    this.folioStore.setCurrentFolioView(id);
    if (environment.ianConfig.showLogs) {
      // console.log('allFolios', this.folioStore.allFolios());
      // console.log('allFolioViews', this.folioStore.allComputedFolioViews());
      // console.log('allPlacements', this.folioStore.allPlacements());
      // console.log('allPlacementViews', this.folioStore.allPlacementViews());
    }
  }
  newFolio() {
    this.folioStore.toggleFolioAdder(true);
    this.newFolioEditorStateChange.emit(true);
  }
}
