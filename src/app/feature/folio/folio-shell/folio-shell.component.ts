import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { AuthorStore } from '../../author/author.store';
import { AssetType, AuthorView, TabList } from '../../../core/models/interfaces';
import { IconPlusComponent } from '../../../core/svg/icon-plus';
import { ChannelAssetsComponent } from '../asset-manager/asset-manager.component';
import { DirectComponent } from '../../pitch/direct/direct.component';
import { AUTHOR_DEFAULT_NAME } from '../../../core/models/constants';
import { Router } from '@angular/router';
@Component({
  selector: 'mh5-folio-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    FolioScrollHorizontalComponent,
    FolioPlacementNewComponent,
    IconPlusComponent,
    ChannelAssetsComponent,
    DirectComponent,
  ],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  assetTypeSelected = signal<AssetType>(AssetType.Folio);

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
  showModalDialog = signal(false);

  openPage(page: string) {
    this.router.navigate([page]);
  }

  openNewFolio() {
    this.assetTypeSelected.set(AssetType.Folio);
    this.showModalDialog.set(true);
  }

  openNewPlacement() {
    this.assetTypeSelected.set(AssetType.Placement);
    this.showModalDialog.set(true);
  }
  closeNewPlacement() {
    this.showModalDialog.set(false);
  }

  openNewPitch() {
    this.assetTypeSelected.set(AssetType.Pitch);

    this.showModalDialog.set(true);
  }

  closeEditorDialog() {
    this.showModalDialog.set(false);
  }
}
