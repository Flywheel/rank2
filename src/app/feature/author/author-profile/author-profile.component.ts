import { Component, computed, inject, input, signal } from '@angular/core';
import { AuthorStore } from '../author.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconTimelineComponent } from '../../../core/svg/icon-timeline';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthorConsentComponent } from '../author-consent/author-consent.component';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, IconTimelineComponent, AuthorConsentComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent {
  channelName = signal<string>('miniherald');
  showConsentPopup = signal(true);
  forcePopup = input<boolean>(false);
  localStorageService = inject(LocalStorageService);

  isChannelNameOk = computed<boolean>(() => this.channelName().length >= 3 && this.channelName().length <= 15);

  closeConsentComponent() {
    this.showConsentPopup.set(false);
  }
  runSomething() {
    this.localStorageService.updateStorage();
  }
  authorStore = inject(AuthorStore);
  isBackDoorOpen = signal<boolean>(true);

  InitializeAuthorHandle() {
    throw new Error('Method not implemented.');
  }
}
