import { Component, computed, effect, inject, input, output, untracked } from '@angular/core';
import { FolioStore } from '../folio.store';
import { FolioView } from '../../../core/models/interfaces';
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
  theFoliosInput = input<FolioView[]>();
  newFolioEditorStateChange = output<boolean>();
  newPlacementEditorStateChange = output<boolean>();

  firstFolioId = computed<number>(() => this.theFoliosInput()?.[0]?.id ?? 0);

  constructor() {
    effect(() => {
      const folioId = this.firstFolioId();
      if (folioId > 0) {
        untracked(() => this.selectFolio(folioId));
      }
    });
  }

  selectFolio(id: number) {
    this.folioStore.setFolioSelected(id);
  }
  newFolio() {
    this.folioStore.toggleFolioAdder(true);
    this.newFolioEditorStateChange.emit(true);
  }
  newPlacement() {
    this.folioStore.togglePlacementAdder(true);
    this.newPlacementEditorStateChange.emit(true);
  }
}
