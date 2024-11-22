import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { pitchViewInit } from '../../../core/models/initValues';
import { AuthorView, PitchView } from '../../../core/models/interfaces';
import { AuthorStore } from '../../author/author.store';
import { PitchStore } from '../../pitch/pitch.store';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-home-menu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.scss',
})
export class HomeMenuComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);

  selectedAuthorName = signal<string>(environment.ianConfig.defaultAuthor);
  selectedPitch = signal<PitchView>(pitchViewInit);

  authorList = computed<AuthorView[]>(() => {
    return this.authorStore.authorViews();
  });

  pitchViews = computed<PitchView[]>(() => {
    const selectedAuthorView = this.authorStore.authorViews().find(a => a.name === this.selectedAuthorName());
    if (selectedAuthorView) {
      return selectedAuthorView.pitches.filter(p => p.id > 0);
    } else return [pitchViewInit];
  });

  constructor() {
    effect(() => {
      const authors = this.authorList();
      if (authors.length > 0) {
        console.log('Authors: ', authors);
        const firstAuthor = authors[0];

        console.log(firstAuthor);
        untracked(() => this.onAuthorChange(firstAuthor.name));
      }
    });
  }

  private getAuthorIdByName(authorName: string): string {
    const author = this.authorStore.authorViews().find(a => a.name === authorName);
    return author ? author.id : '';
  }

  onAuthorChange(authorName: string): void {
    this.selectedAuthorName.set(authorName);
    const firstPitch = this.pitchViews().find(p => p.authorId === this.getAuthorIdByName(authorName));
    if (firstPitch) {
      this.selectPitch(firstPitch);
    } else {
      console.warn(`No pitches found for author: ${authorName}`);
    }
  }

  selectPitch(pitchView: PitchView) {
    this.selectedPitch.set(pitchView);
    this.pitchStore.setPitchSelected(pitchView.id);
  }

  scrollToElement(targetPitch: number) {
    const target = `menu-item:${targetPitch}`;
    const element = document.getElementById(target);
    console.log('scrollToElement: ', element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }

  scrollRight(isNext: boolean) {
    const currentIndex = this.pitchViews().findIndex(pv => pv.name === this.selectedPitch().name);
    let newIndex = isNext ? currentIndex + 1 : currentIndex - 1;

    if (currentIndex === -1) return;
    if (newIndex >= this.pitchViews().length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = this.pitchViews().length - 1;
    }
    this.selectPitch(this.pitchViews()[newIndex]);
    this.scrollToElement(this.selectedPitch().id);
  }
}
