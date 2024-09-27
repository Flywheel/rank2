import { Component, inject, input, output } from '@angular/core';
import { FolioStore } from '../folio.store';
import { Folio } from '../../../shared/interfaces/interfaces';
import { environment } from '../../../../environments/environment';
import { IconPlusComponent } from '../../../shared/svg/icon-plus';
import { IconProfileComponent } from '../../../shared/svg/icon-profile';
import { IconShareComponent } from '../../../shared/svg/icon-share';

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
      console.log('allFolios', this.folioStore.allFolios());
      console.log('allFolioViews', this.folioStore.allFolioViews());
      //  console.log('allFolioViews2', this.folioStore.allFolioViews());

      // console.log('allAssets', this.folioStore.allAssets());
      // console.log('allAssetViews', this.folioStore.allAssetViews2());

      console.log('allPlacements', this.folioStore.allPlacements());
      console.log('allPlacementViews', this.folioStore.allPlacements());
      //   console.log('allPlacementViews2', this.folioStore.allPlacementViews());
    }
  }
  newFolio() {
    this.folioStore.toggleFolioAdder(true);
    this.newFolioEditorStateChange.emit(true);
  }
}
