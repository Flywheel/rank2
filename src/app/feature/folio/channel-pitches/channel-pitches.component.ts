import { Component } from '@angular/core';
import { ContestNewComponent } from '../../contest/contest-new/contest-new.component';

@Component({
  selector: 'mh5-channel-pitches',
  standalone: true,
  imports: [ContestNewComponent],
  templateUrl: './channel-pitches.component.html',
  styleUrl: './channel-pitches.component.scss',
})
export class ChannelPitchesComponent {}
