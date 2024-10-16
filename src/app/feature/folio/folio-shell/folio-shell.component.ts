import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { FolioStore } from '../folio.store';
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
import { LocalStorageService } from '../../../core/services/local-storage.service';

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
  ],
  templateUrl: './folio-shell.component.html',
  styleUrl: './folio-shell.component.scss',
})
export class FolioShellComponent {
  folioStore = inject(FolioStore);
  authorStore = inject(AuthorStore);
  localStorageService = inject(LocalStorageService);
  isHydrated = false;

  tabs: TabList[] = [
    { name: 'Assets', title: 'Assets' },
    { name: 'Pitches', title: 'Pitches' },
    { name: 'Slates', title: 'Slates' },
  ];
  selectedTab = this.tabs[0];

  showViewer = false;
  theFolios = this.authorStore.authorFolioViews;
  newFolio = signal(false);
  newPlacement = signal(false);

  openNewPlacement() {
    this.newPlacement.set(true);
  }
  closeNewPlacement() {
    this.newPlacement.set(false);
  }

  runLog() {
    if (!this.isHydrated) {
      this.localStorageService.hydrateStuff();
      this.isHydrated = true;
    }

    if (environment.ianConfig.showLogs) {
      console.log(this.theFolios());
      console.log(this.folioStore.placementViewsComputed());
      console.log(this.folioStore.placements());
      console.log(this.authorStore.folioTreeData());
    }
  }
}
// treeData: TreeNode[] = [
//   {
//     name: 'Root',
//     children: [
//       { name: 'Child 1' },
//       {
//         name: 'Child 2',
//         children: [
//           { name: 'Grandchild 1' },

//           { name: 'Grandchild 2', children: [{ name: 'Great Grandchild1' }, { name: 'Great Grandchild 2' }] },
//           { name: 'Grandchild 3' },
//         ],
//       },
//     ],
//   },
// ];
