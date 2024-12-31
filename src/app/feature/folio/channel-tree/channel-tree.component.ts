import { Component, input } from '@angular/core';
import { TreeNode } from '@shared/models/interfaces';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mh5-channel-tree',
  standalone: true,
  imports: [CommonModule],
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
  selectNode(node: TreeNode): void {
    if (environment.ianConfig.showLogs) {
      console.log(node);
      console.log(this.nodes());
    }

    this.nodes().forEach(node => (node.isSelected = false));
    node.isSelected = true;
  }
}
