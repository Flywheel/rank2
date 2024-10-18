import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '../../author/author.store';
import { ChannelTreeComponent } from '../channel-tree/channel-tree.component';
import { TabList } from '../../../core/models/interfaces';
import { IconPlusComponent } from '../../../core/svg/icon-plus';
import { ChannelAssetsComponent } from '../channel-assets/channel-assets.component';
import { ChannelPitchesComponent } from '../channel-pitches/channel-pitches.component';
import { HydrationService } from '../../../core/services/hydration.service';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';
import { DirectComponent } from '../../contest/direct/direct.component';

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
    ChannelPitchesComponent,
    ContestNewComponent,
    DirectComponent,
  ],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  authorStore = inject(AuthorStore);
  localStorageService = inject(HydrationService);
  isHydrated = false;

  tabs: TabList[] = [
    { name: 'Assets', title: 'Assets' },
    { name: 'Pitches', title: 'Pitches' },
    { name: 'Slates', title: 'Slates' },
  ];
  selectedTab = this.tabs[0];

  showViewer = false;
  theFolios = this.authorStore.authorFolioViews;
  // //  thePitches  = this.authorStore.authorPitchViews;
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

  runLog() {
    if (!this.isHydrated) {
      this.localStorageService.hydrateStuff();
      this.isHydrated = true;
    }

    if (environment.ianConfig.showLogs) {
      console.log(this.authorStore.folioTreeData());
    }
  }
}
