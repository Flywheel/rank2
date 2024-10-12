import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { FolioStore } from '../folio.store';
import { FolioScrollHorizontalComponent } from '../folio-scroll-horizontal/folio-scroll-horizontal.component';
import { FolioPlacementNewComponent } from '../folio-placement-new/folio-placement-new.component';
import { FolioPlacementListComponent } from '../folio-placement-list/folio-placement-list.component';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '../../author/author.store';
import { ChannelTreeComponent } from '../channel-tree/channel-tree.component';
import { FolioLister, FolioView, PlacementView, TreeNode } from '../../../core/models/interfaces';
import { NewPlacementComponent } from '../new-placement/new-placement.component';
import { IconPlusComponent } from '../../../core/svg/icon-plus';
import { ChannelAssetsComponent } from '../channel-assets/channel-assets.component';

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
    ChannelAssetsComponent,
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
    return folios
      .filter(folio => !folio.parentFolioId) // Start with root folios (no parent)
      .map(folio => this.buildTreeNode(folio, 0, folios));
  });

  private buildTreeNode(folioView: FolioView, depth: number, allFolios: FolioView[], path: number[] = []): TreeNode {
    if (path.includes(folioView.id)) {
      return {
        name: `f ${'-'.repeat(depth)} ${folioView.folioName} (cycle detected)`,
        children: [],
        isSelected: false,
      };
    }

    const newPath = [...path, folioView.id];
    const levelIndicator = '-'.repeat(depth);
    const node: TreeNode = {
      name: `${levelIndicator} ${folioView.folioName}`,
      children: [],
      isSelected: false,
    };

    folioView.placementViews.forEach(placement => {
      if (placement.asset.mediaType === 'folio') {
        const referencedFolio = this.getFolioById(Number(placement.asset.sourceId), allFolios);
        if (referencedFolio) {
          node.children?.push(this.buildTreeNode(referencedFolio, depth + 1, allFolios, newPath));
        }
      } else {
        // Include non-folio placements with level indicators
        node.children?.push({
          name: `${placement.caption}`,
          children: [],
          isSelected: false,
        });
      }
    });

    return node;
  }

  private buildPlacementNode(placement: PlacementView, depth: number, allFolios: FolioView[]): TreeNode {
    const indexer = '-'.repeat(depth); // Add hyphens based on depth

    if (environment.ianConfig.showLogs) {
      console.log(`Processing Placement: ${placement.caption}`);
      console.log(`Media Type: ${placement.asset.mediaType}`);
    }

    const node: TreeNode = {
      name: `p ${indexer} ${placement.caption}`,
      isSelected: false, // Initialize as not selected
    };

    // If the placement references another folio, find and add it recursively
    if (placement.asset.mediaType === 'folio') {
      const referencedFolio = this.getFolioById(Number(placement.asset.sourceId), allFolios);
      if (referencedFolio) {
        const childFolioNode = this.buildTreeNode(referencedFolio, depth + 1, allFolios);
        node.children = [childFolioNode];
      } else {
        if (environment.ianConfig.showLogs) {
          console.warn(`Referenced folio with ID ${placement.asset.sourceId} not found.`);
        }
      }
    }
    return node;
  }

  private getFolioById(folioId: number, allFolios: FolioView[]): FolioView | undefined {
    return allFolios.find(folio => folio.id === folioId);
  }

  openNewPlacement() {
    this.newPlacement.set(true);
  }
  closeNewPlacement() {
    this.newPlacement.set(false);
  }

  runLog() {
    if (environment.ianConfig.showLogs) {
      console.log(this.folioTreeData());
    }
  }

  folioList = computed<FolioView[]>(() => {
    const folios = this.theFolios();
    const result: FolioLister[] = [];

    const retval: FolioView[] = [];

    const traverseFolios = (folio: FolioView, depth: number, path: number[] = []) => {
      if (path.includes(folio.id)) {
        // Avoid cycles
        return;
      }
      const newPath = [...path, folio.id];

      // Add current folio to the result
      result.push({
        id: folio.id,
        folioName: folio.folioName,
        level: depth,
      });

      folio.level = depth;
      retval.push(folio);

      // Traverse child folios
      folio.placementViews.forEach(placement => {
        if (placement.asset.mediaType === 'folio') {
          const childFolio = this.getFolioById(Number(placement.asset.sourceId), folios);
          if (childFolio) {
            traverseFolios(childFolio, depth + 1, newPath);
          }
        }
      });
    };

    // Start traversal from root folios (no parent)
    folios
      .filter(folio => !folio.parentFolioId)
      .forEach(folio => {
        traverseFolios(folio, 0);
      });

    return retval;
  });
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
