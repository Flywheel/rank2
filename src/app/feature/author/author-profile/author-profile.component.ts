import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthorStore } from '../author.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconTimelineComponent } from '../../../core/svg/icon-timeline';
import { HydrationService } from '../../../core/services/hydration.service';
import { AuthorConsentComponent } from '../author-consent/author-consent.component';
import { environment } from '../../../../environments/environment';
import { Author, Folio } from '../../../core/models/interfaces';
// import { uuidv7 } from 'uuidv7';
import { AUTHOR_DEFAULT_NAME } from '../../../core/models/constants';
import { FolioStore } from '../../folio/folio.store';
import { DirectComponent } from '../../pitch/direct/direct.component';
import { PitchStore } from '../../pitch/pitch.store';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, IconTimelineComponent, AuthorConsentComponent, DirectComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent implements AfterViewInit {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(PitchStore);
  isRunSomethingVisible = signal<boolean>(true);
  channelName = signal<string>('');
  showConsentPopup = signal(false);
  localStorageService = inject(HydrationService);
  authorDefaultName = AUTHOR_DEFAULT_NAME;

  isChannelNameOk = computed<boolean>(() => this.channelName().length >= 3 && this.channelName().length <= 15);
  @ViewChild('newHandleInput') newHandleInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    // Check if the input element exists before setting focus
    if (this.newHandleInput && this.newHandleInput.nativeElement) {
      this.newHandleInput.nativeElement.focus();
    }
  }

  showConsentDialog() {
    if (environment.ianConfig.showLogs) console.log('ShowConsentDialog', this.showConsentPopup());
    this.showConsentPopup.set(true);
  }

  closeConsentDialog() {
    if (environment.ianConfig.showLogs) console.log('CloseConsentDialog', this.showConsentPopup());
    this.showConsentPopup.set(false);
    if (environment.ianConfig.showLogs) console.log('CloseConsentDialog', this.showConsentPopup());
  }

  runSomething() {
    const loggedInAuthorData = this.authorStore.authorLoggedIn();
    if (environment.ianConfig.showLogs) console.log(loggedInAuthorData);
    this.authorStore.authorSelectedSetById(loggedInAuthorData.id);
    if (environment.ianConfig.showLogs) {
      console.log(loggedInAuthorData);
      console.log(this.authorStore.authorLoggedIn());
      console.log(loggedInAuthorData.id, this.channelName());
    }
  }

  initializeAuthorHandle() {
    const currentAuthor = this.authorStore.authorLoggedIn();
    const updatedAuthorData: Author = { id: currentAuthor.id, name: this.channelName() };
    this.authorStore.authorLoggedInUpdate(currentAuthor.id, updatedAuthorData);
    const newFolio: Folio = {
      id: 0,
      authorId: currentAuthor.id,
      folioName: '@' + this.channelName(),
    };
    this.folioStore.folioCreateForNewAuthor(newFolio);
    if (environment.ianConfig.showLogs) {
      console.log(currentAuthor);
      console.log(updatedAuthorData);
      console.log(newFolio);
    }
  }
}
