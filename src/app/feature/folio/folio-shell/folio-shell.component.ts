import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';
import { AuthorStore } from '../../author/author.store';
import { ChannelTreeComponent } from '../channel-tree/channel-tree.component';
import { TabList } from '../../../core/models/interfaces';
import { IconPlusComponent } from '../../../core/svg/icon-plus';
import { ChannelAssetsComponent } from '../asset-manager/asset-manager.component';
import { SlateManagerComponent } from '../slate-manager/slate-manager.component';
import { DirectComponent } from '../../pitch/direct/direct.component';
import { ContestNewComponent } from '../pitch-new/pitch-new.component';

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
    ContestNewComponent,
  ],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  authorStore = inject(AuthorStore);

  tabs: TabList[] = [
    { name: 'Assets', title: 'Assets' },
    { name: 'Pitches', title: 'Pitches' },
    { name: 'Slates', title: 'Slates' },
  ];
  selectedTab = this.tabs[0];

  showViewer = false;
  theFolios = this.authorStore.authorFolioViews;
  thePitches = this.authorStore.authorPitchViews;
  newPitch = signal(false);
  newPlacement = signal(false);

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
