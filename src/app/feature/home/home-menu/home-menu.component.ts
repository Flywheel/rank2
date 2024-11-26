import { Component, computed, inject, signal } from '@angular/core';
import { pitchViewInit } from '../../../core/models/initValues';
import { AuthorView, PitchView } from '../../../core/models/interfaces';
import { AuthorStore } from '../../author/author.store';
import { PitchStore } from '../../pitch/pitch.store';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { IconArrowBackComponent } from '../../../core/svg/icon-arrow-back';
import { IconArrowForwardComponent } from '../../../core/svg/icon-arrow-forward';

@Component({
  selector: 'mh5-home-menu',
  standalone: true,
  imports: [FormsModule, IconArrowBackComponent, IconArrowForwardComponent],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.scss',
})
export class HomeMenuComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);

  selectedAuthorName = signal<string>(environment.ianConfig.defaultAuthor);
  topChannel = computed<string>(() => '@' + this.selectedAuthorName());
  selectedPitch = signal<PitchView>(pitchViewInit);
  isSelectClicked = signal<boolean>(false);

  authorList = computed<AuthorView[]>(() => {
    return this.authorStore.authorViews();
  });

  pitchViews = computed<PitchView[]>(() => {
    const selectedAuthorView = this.authorStore.authorViews().find(a => a.name === this.selectedAuthorName());
    if (selectedAuthorView) {
      return selectedAuthorView.pitches.filter(p => p.id > 0);
    } else return [pitchViewInit];
  });

  // constructor() {
  //   this.onAuthorChange(this.selectedAuthorName());
  // }

  // private getAuthorIdByName(authorName: string): string {
  //   const author = this.authorStore.authorViews().find(a => a.name === authorName);
  //   return author ? author.id : '';
  // }

  onAuthorChange(authorName: string): void {
    this.selectedAuthorName.set(authorName);
    const firstPitch = this.pitchViews()[0];
    if (firstPitch) {
      this.selectPitch(firstPitch);
    } else {
      console.warn(`No pitches found for author: ${authorName}`);
    }
  }

  selectPitch(pitchView: PitchView) {
    this.isSelectClicked.set(false);
    this.selectedPitch.set(pitchView);
    this.pitchStore.setPitchSelected(pitchView.id);
  }

  onSelectClick(): void {
    this.isSelectClicked.set(true);
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
    if (currentIndex === -1) return;
    const itemCount = this.pitchViews().length;
    let newIndex = isNext ? currentIndex + 1 : currentIndex - 1;
    newIndex = newIndex >= itemCount ? 0 : newIndex < 0 ? itemCount - 1 : newIndex;

    this.selectPitch(this.pitchViews()[newIndex]);
    if (newIndex === 0) this.isSelectClicked.set(true);
    this.scrollToElement(this.selectedPitch().id);
  }
}
