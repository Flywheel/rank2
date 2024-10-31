import { Component, computed, inject, signal } from '@angular/core';
import { Author, PitchView } from '../../../core/models/interfaces';
import { PitchStore } from '../pitch.store';
import { AuthorStore } from '../../author/author.store';
import { pitchViewInit } from '../../../core/models/initValues';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mh5-pitch-scroller',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="horizontal-scroll">
      <select class="content-type-dropdown" [ngModel]="selectedAuthorName()" (ngModelChange)="selectedAuthorName.set($event)">
        @for (author of authorList(); track $index) {
          <option [value]="author.name">{{ author.name }}</option>
        }
      </select>

      @for (pitch of pitchViews(); track $index) {
        <div class="menu-item" (click)="selectPitch(pitch.id)" (keydown)="selectPitch(pitch.id)" tabindex="$index">
          {{ pitch.name }}
        </div>
      }
    </div>
  `,
  styles: [],
})
export class PitchScrollerComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);

  selectedAuthorName = signal<string>('miniherald');

  authorList = computed<Author[]>(() => {
    return this.authorStore.authors().filter(a => a.id.length > 2);
  });

  pitchViews = computed<PitchView[]>(() => {
    if (this.authorStore.authorViews().length > 0) {
      return this.authorStore
        .authorViews()
        .filter(a => (a.name = this.selectedAuthorName()))[0]
        .pitches.filter(p => p.id > 0);
    } else return [pitchViewInit];
  });

  selectPitch(id: number) {
    this.pitchStore.setPitchSelected(id);
  }
}
