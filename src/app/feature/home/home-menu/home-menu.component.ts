import { Component, computed, inject, signal } from '@angular/core';
import { pitchViewInit } from '../../../core/models/initValues';
import { AuthorView, PitchView } from '../../../core/models/interfaces';
import { AuthorStore } from '../../author/author.store';
import { PitchStore } from '../../pitch/pitch.store';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { IconDropDownComponent } from '../../../core/svg/icon-arrow-dropdown';
import { IconFrameComponent } from '../../../core/svg/icon-frame';

@Component({
  selector: 'mh5-home-menu',
  standalone: true,
  imports: [FormsModule, IconDropDownComponent, IconFrameComponent],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.scss',
})
export class HomeMenuComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);

  selectedAuthorName = signal<string>(environment.ianConfig.defaultAuthor);

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

  scrollToElement(targetPitch: number) {
    const target = `menu-item:${targetPitch}`;
    const element = document.getElementById(target);
    console.log('scrollToElement: ', element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }

  scrollNext(isNext: boolean) {
    const currentIndex = this.pitchViews().findIndex(pv => pv.name === this.selectedAuthorName());
    let newIndex = isNext ? currentIndex + 1 : currentIndex - 1;

    if (currentIndex === -1) return;
    if (newIndex >= this.pitchViews().length) {
      newIndex = 0; // Loop back to the first author
    } else if (newIndex < 0) {
      newIndex = this.pitchViews().length - 1; // Loop to the last author
    }

    this.selectedAuthorName.set(this.pitchViews()[newIndex].name);
  }

  async loadChildPitchByLocation(location: string) {
    const pitchId = Number(location);
    this.selectedAuthorName.set(location);
    await this.loadChildPitch(pitchId);
    //   this.changeDetectorRef.detectChanges();
    this.scrollToElement(pitchId);
  }

  async loadChildPitch(pitchId: number) {
    //   await this.pitchStore.loadPitchViewByPitchId(pitchId);
  }
}
