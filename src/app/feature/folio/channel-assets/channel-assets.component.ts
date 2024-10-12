import { Component, input } from '@angular/core';
import { FolioView } from '../../../core/models/interfaces';

@Component({
  selector: 'mh5-channel-assets',
  standalone: true,
  imports: [],
  templateUrl: './channel-assets.component.html',
  styleUrl: './channel-assets.component.scss',
})
export class ChannelAssetsComponent {
  showPlacements(folioID: number) {
    console.log(folioID);
  }

  lister = input<FolioView[]>([]);
}
