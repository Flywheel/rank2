import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { FolioStore } from '../folio.store';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '../../author/author.store';
import { ChannelTreeComponent } from '../channel-tree/channel-tree.component';
import { TreeNode } from '../../../core/interfaces/interfaces';
import { NewPlacementComponent } from '../new-placement/new-placement.component';
import { IconPlusComponent } from '../../../core/svg/icon-plus';

@Component({
  selector: 'mh5-folio-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    FolioScrollHorizontalComponent,
    FolioPlacementListComponent,
    FolioPlacementNewComponent,
    ChannelTreeComponent,
    NewPlacementComponent,
    IconPlusComponent,
  ],
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

  folioTreeData = computed<TreeNode[]>(() => {
    const folios = this.theFolios();
    return folios.map(folio => {
      return {
        name: folio.folioName,
        children: folio.placementViews.map(placement => {
          return {
            name: placement.caption,
          };
        }),
      };
    });
  });

  // folioTreeData2 = computed<TreeNode[]>(() => {
  //   const folios = this.theFolios();
  //   const treeData: TreeNode[] = [];

  //   folios.forEach(folio => {
  //     if (!folio.parentFolioId) { // Assuming folios have a parentFolioId property
  //       const node: TreeNode = {
  //         name: folio.folioName,
  //         children: this.getChildPlacements(folio.id, folios),
  //       };
  //       treeData.push(node);
  //     }
  //   });

  //   return treeData;
  // });

  // private getChildPlacements(parentFolioId: number, folios: Folio[]): TreeNode[] {
  //   return folios
  //     .filter(folio => folio.parentFolioId === parentFolioId)
  //     .map(folio => ({
  //       name: folio.folioName,
  //       children: this.getChildPlacements(folio.id, folios),
  //     }));
  // }

  // folioTreeData = computed<TreeNode[]>(() => {
  //   const folios = this.theFolios();
  //   const rootFolios = folios.filter(folio => !folio.parentFolioId);

  //   return rootFolios.map(rootFolio => this.buildTreeNode(rootFolio, folios));
  // });

  // private buildTreeNode(folio: Folio, allFolios: Folio[]): TreeNode {
  //   const children = allFolios.filter(child => child.parentFolioId === folio.id);
  //   return {
  //     name: folio.folioName,
  //     children: children.map(childFolio => this.buildTreeNode(childFolio, allFolios)),
  //   };
  // }

  treeData: TreeNode[] = [
    {
      name: 'Root',
      children: [
        { name: 'Child 1' },
        {
          name: 'Child 2',
          children: [
            { name: 'Grandchild 1' },

            { name: 'Grandchild 2', children: [{ name: 'Great Grandchild1' }, { name: 'Great Grandchild 2' }] },
            { name: 'Grandchild 3' },
          ],
        },
      ],
    },
  ];

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
