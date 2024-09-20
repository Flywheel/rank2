import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FolioStore } from '../folio.store';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioNewComponent } from '../folio-new/folio-new.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { LogService } from '../../../core/log/log.service';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';

@Component({
  selector: 'mh5-folio-shell',
  standalone: true,
  imports: [HeaderComponent, FolioScrollHorizontalComponent, FolioNewComponent, FolioPlacementListComponent, FolioPlacementNewComponent],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  folioStore = inject(FolioStore);
  logger = inject(LogService);
  showViewer = false;
  theFolios = this.folioStore.allFolios;
  newFolio = signal(false);
  newPlacement = signal(false);
  openNewFolio() {
    this.newFolio.set(true);
  }
  closeNewFolio() {
    this.newFolio.set(false);
    if (this.logger.enabled) console.log(this.theFolios());
  }
  openNewPlacement() {
    this.newPlacement.set(true);
  }
  closeNewPlacement() {
    this.newPlacement.set(false);
  }
}
