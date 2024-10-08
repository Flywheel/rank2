import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { FolioStore } from '../folio.store';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioNewComponent } from '../folio-new/folio-new.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-folio-shell',
  standalone: true,
  imports: [HeaderComponent, FolioScrollHorizontalComponent, FolioNewComponent, FolioPlacementListComponent, FolioPlacementNewComponent],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  folioStore = inject(FolioStore);
  authorStore = inject(AuthorStore);

  showViewer = false;
  theFolios = this.authorStore.authorFolioViews;
  newFolio = signal(false);
  newPlacement = signal(false);

  openNewFolio() {
    this.newFolio.set(true);
  }
  closeNewFolio() {
    this.newFolio.set(false);
    if (environment.ianConfig.showLogs) console.log(this.theFolios());
  }
  openNewPlacement() {
    this.newPlacement.set(true);
  }
  closeNewPlacement() {
    this.newPlacement.set(false);
  }

  RunTest() {
    //
  }
}
