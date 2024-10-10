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

  firstFolioId = computed<number>(() => {
    const z = this.theFoliosInput();
    if (z !== undefined) {
      const x = z.length ?? 0;
      return x > 0 ? z[0].id : 0;
    }
    return 0;
  });

  constructor() {
    effect(() => {
      const a = this.firstFolioId();
      console.log(a);
      untracked(() => {
        if (a > 0) {
          this.selectFolio(a);
        }
      });
    });
  }

  selectFolio(id: number) {
    this.folioStore.setFolioSelected(id);
    if (environment.ianConfig.showLogs) {
      console.log('folioViewSelected', this.folioStore.folioViewSelected());
    }
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
