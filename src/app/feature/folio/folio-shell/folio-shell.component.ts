import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { AuthorStore } from '@feature/author/author.store';
import { AssetType, AuthorView, TabList } from '@shared/models/interfaces';
import { IconPlusComponent } from '@shared/svg/icon-plus';
import { AssetManagerComponent } from '../tabs/asset-manager/asset-manager.component';
import { BackdoorComponent } from '@shared/components/backdoor/backdoor.component';
import { AUTHOR_DEFAULT_NAME } from '@shared/models/constants';
import { Router } from '@angular/router';
import { PitchManagerComponent } from '../tabs/pitch-manager/pitch-manager.component';
import { SlatesAuthoredComponent } from '../tabs/slates-authored/slates-authored.component';
import { NamegetterComponent } from '@shared/components/namegetter/namegetter.component';
@Component({
  selector: 'mh5-folio-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    FolioScrollHorizontalComponent,
    FolioPlacementNewComponent,
    IconPlusComponent,
    AssetManagerComponent,
    BackdoorComponent,
    PitchManagerComponent,
    SlatesAuthoredComponent,
    NamegetterComponent,
  ],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  assetTypeSelected = signal<AssetType>(AssetType.Folio);

  router = inject(Router);
  authorStore = inject(AuthorStore);
  knownAuthors = computed<AuthorView[]>(() => this.authorStore.authorViews());

  tabs = signal<TabList[]>([
    { name: 'Assets', title: 'Assets' },
    { name: 'Pitches', title: 'Pitches' },
    { name: 'Slates', title: 'Slates' },
  ]);
  selectedTab = this.tabs()[0];

  showViewer = false;
  theFolios = this.authorStore.authorSelectedFolioViewsWithDepth;
  thePitches = this.authorStore.authorSelectedPitchViews;
  newPitch = signal(false);
  showModalDialog = signal(false);

  openPage(page: string) {
    this.router.navigate([page]);
  }

  tabWanted(tab: string) {
    this.selectedTab = this.tabs().find(t => t.name === tab) ?? this.tabs()[0];
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
