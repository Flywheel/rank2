import { Component, computed, inject, input, signal } from '@angular/core';
import { AuthorStore } from '../author.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconTimelineComponent } from '../../../core/svg/icon-timeline';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, IconTimelineComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent {
  channelName = signal<string>('miniherald');
  showConsentPopup = true;
  forcePopup = input<boolean>(false);

  isChannelNameOk = computed<boolean>(() => this.channelName().length >= 3 && this.channelName().length <= 15);

  runSomething() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent && this.forcePopup() === false) {
      this.showConsentPopup = false;
    }
  }
  authorStore = inject(AuthorStore);
  isBackDoorOpen = signal<boolean>(true);

  InitializeAuthorHandle() {
    throw new Error('Method not implemented.');
  }
}
