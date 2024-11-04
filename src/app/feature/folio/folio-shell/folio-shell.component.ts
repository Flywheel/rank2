import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';
import { AuthorStore } from '../../author/author.store';
import { ChannelTreeComponent } from '../channel-tree/channel-tree.component';
import { AuthorView, TabList } from '../../../core/models/interfaces';
import { IconPlusComponent } from '../../../core/svg/icon-plus';
import { ChannelAssetsComponent } from '../asset-manager/asset-manager.component';
import { SlateManagerComponent } from '../slate-manager/slate-manager.component';
import { DirectComponent } from '../../pitch/direct/direct.component';
import { PitchNewComponent } from '../pitch-new/pitch-new.component';
import { AUTHOR_DEFAULT_NAME } from '../../../core/models/constants';
import { Router } from '@angular/router';
@Component({
  selector: 'mh5-folio-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    FolioScrollHorizontalComponent,
    FolioPlacementListComponent,
    FolioPlacementNewComponent,
    ChannelTreeComponent,
    IconPlusComponent,
    ChannelAssetsComponent,
    SlateManagerComponent,
    DirectComponent,
    PitchNewComponent,
  ],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  router = inject(Router);
  authorStore = inject(AuthorStore);
  knownAuthors = computed<AuthorView[]>(() => this.authorStore.authorViews());
  needsAuthorName = computed<boolean>(() => this.authorStore.authorLoggedIn().name === AUTHOR_DEFAULT_NAME);

  tabs: TabList[] = [
    { name: 'Assets', title: 'Assets' },
    { name: 'Pitches', title: 'Pitches' },
    { name: 'Slates', title: 'Slates' },
  ];
  selectedTab = this.tabs[0];

  showViewer = false;
  theFolios = this.authorStore.authorSelectedFolioViews;
  thePitches = this.authorStore.authorSelectedPitchViews;
  newPitch = signal(false);
  newPlacement = signal(false);

  openPage(page: string) {
    this.router.navigate([page]);
  }

  openNewFolio() {
    this.newPlacement.set(true);
  }
  closeNewFolio() {
    this.newPlacement.set(false);
  }

  openNewPlacement() {
    this.newPlacement.set(true);
  }
  closeNewPlacement() {
    this.newPlacement.set(false);
  }

  openNewPitch() {
    this.newPitch.set(true);
  }
  closeNewPitch() {
    this.newPitch.set(false);
  }
}
