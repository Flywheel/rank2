import { Component, computed, inject, signal } from '@angular/core';
import { AuthorStore } from '@feature/author/author.store';
import { pitchViewInit } from '@shared/models/initValues';
import { AuthorView, PitchView } from '@shared/models/interfaces';
import { PitchStore } from '@feature/pitch/pitch.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mh5-ballot-menu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ballot-menu.component.html',
  styleUrl: './ballot-menu.component.scss',
})
export class BallotMenuComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);

  selectedAuthorName = signal<string>('miniherald');

  authorList = computed<AuthorView[]>(() => {
    return this.authorStore.authorViews();
  });

  pitchViews = computed<PitchView[]>(() => {
    const selectedAuthorView = this.authorStore.authorViews().find(a => a.name === this.selectedAuthorName());
    if (selectedAuthorView) {
      return selectedAuthorView.pitches.filter(p => p.id > 0);
    } else return [pitchViewInit];
  });

  selectPitch(id: number) {
    this.pitchStore.setPitchSelected(id);
  }
}
