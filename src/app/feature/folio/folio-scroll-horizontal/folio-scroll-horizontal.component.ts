import { Component, inject, input, output } from '@angular/core';
import { LogService } from '../../../core/log/log.service';
import { FolioStore } from '../folio.store';
import { Folio } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'mh5-folio-scroll-horizontal',
  standalone: true,
  imports: [],
  templateUrl: './folio-scroll-horizontal.component.html',
  styleUrl: './folio-scroll-horizontal.component.scss',
})
export class FolioScrollHorizontalComponent {
  logger = inject(LogService);
  folioStore = inject(FolioStore);
  theFoliosInput = input<Folio[]>();
  newFolioEditorStateChange = output<boolean>();
  newPlacementEditorStateChange = output<boolean>();

  selectFolio(id: number) {
    this.folioStore.setCurrentFolioView(id);
    if (this.logger.enabled) {
      console.log('selectFolio', id);
      console.log('allFolioViews', this.folioStore.allFolioViews());
      console.log('allFolios', this.folioStore.allFolios());
      //  console.log('allFolios', this.folioStore.allFolioView());
    }
  }
  newFolio() {
    this.newFolioEditorStateChange.emit(true);
  }
}
