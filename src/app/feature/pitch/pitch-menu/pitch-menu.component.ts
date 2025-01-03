import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { authorViewInit, pitchViewInit } from '@shared/models/initValues';
import { AuthorView, PitchView } from '@shared/models/interfaces';
import { AuthorStore } from '@feature/author/author.store';
import { PitchStore } from '@feature/pitch/pitch.store';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { IconArrowBackComponent } from '@shared/svg/icon-arrow-back';
import { IconArrowForwardComponent } from '@shared/svg/icon-arrow-forward';
import { AUTHOR_DEFAULT_NAME } from '@shared/models/constants';
@Component({
  selector: 'mh5-pitch-menu',
  standalone: true,
  imports: [FormsModule, IconArrowBackComponent, IconArrowForwardComponent],
  templateUrl: './pitch-menu.component.html',
  styleUrl: './pitch-menu.component.scss',
})
export class PitchMenuComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);
  returnToPitchFromView = input<number>();

  topPitchSelected = signal<boolean>(false);
  selectedAuthorName = signal<string>(environment.ianConfig.defaultAuthor);

  selectedPitch = computed<PitchView>(() => this.pitchStore.pitchViewSelected());

  selectedAuthor = computed<AuthorView>(
    () => this.authorStore.authorViews().find(a => a.name === this.selectedAuthorName()) ?? authorViewInit
  );

  topChannel = computed<string>(() => '@' + this.selectedAuthorName());

  authorList = computed<AuthorView[]>(() => {
    return this.authorStore.authorViews().filter(a => a.name !== AUTHOR_DEFAULT_NAME);
  });

  pitchViews = computed<PitchView[]>(() => {
    const selectedAuthorView = this.authorStore.authorViews().find(a => a.name === this.selectedAuthorName());
    if (selectedAuthorView) {
      return selectedAuthorView.pitches.filter(p => p.id > 0);
    } else return [pitchViewInit];
  });

  preparePitchDisplay = effect(() => {
    this.returnToPitchFromView();
    if (this.authorStore.startupCompleted()) {
      untracked(() => {
        if (this.returnToPitchFromView()) {
          this.returnToPitch();
        } else {
          this.onSelectTopPitchClick();
        }
      });
    }
  });

  returnToPitch() {
    console.log('returnToPitch: ', this.selectedAuthor().name);
    const isFirstAuthor = this.authorStore.authorViews()[0].name === this.selectedAuthor().name;
    if (!isFirstAuthor) {
      const pitchIndex = this.pitchViews().findIndex(pv => pv.name === this.pitchStore.pitchViewSelected().name);
      this.selectPitch(this.pitchViews()[pitchIndex]);
      if (pitchIndex === 0) this.topPitchSelected.set(true);
      this.scrollToElement(this.pitchStore.pitchIdSelected());
    } else {
      console.log('returnToPitch: ', this.selectedAuthor().name);
    }
  }

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
    this.topPitchSelected.set(false);
    this.pitchStore.setPitchSelected(pitchView.id);
  }

  onSelectTopPitchClick(): void {
    this.selectPitch(this.pitchViews()[0]);
    this.topPitchSelected.set(true);
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
    if (newIndex === 0) this.topPitchSelected.set(true);
    this.scrollToElement(this.selectedPitch().id);
  }
}
