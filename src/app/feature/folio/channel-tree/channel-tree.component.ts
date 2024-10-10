import { Component, input } from '@angular/core';
import { TreeNode } from '../../../core/models/interfaces';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-channel-tree',
  standalone: true,
  imports: [],
  templateUrl: './channel-tree.component.html',
  styleUrl: './channel-tree.component.scss',
})
export class ChannelTreeComponent {
  nodes = input<TreeNode[]>([]);

  toggleChildren(node: TreeNode): void {
    if (environment.ianConfig.showLogs) console.log(node);
    this.nodes()
      .filter(n => n !== node)
      .forEach(n => {
        if (n.children) {
          n.children = [];
        }
      });
  }
}
