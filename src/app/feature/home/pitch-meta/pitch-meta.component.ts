import { Component, inject } from '@angular/core';
import { PitchStore } from '@feature/pitch/pitch.store';

@Component({
  selector: 'mh5-pitch-meta',
  standalone: true,
  imports: [],
  templateUrl: './pitch-meta.component.html',
  styleUrl: './pitch-meta.component.scss',
})
export class PitchMetaComponent {
  pitchStore = inject(PitchStore);
}
