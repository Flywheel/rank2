import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthorStore } from '../author.store';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HydrationService } from '@shared/services/hydration.service';
import { AuthorConsentComponent } from '../author-consent/author-consent.component';
import { environment } from 'src/environments/environment';
import { Author, Folio, Pitch } from '@shared/models/interfaces';
import { AUTHOR_DEFAULT_NAME } from '@shared/models/constants';
import { FolioStore } from '@feature/folio/folio.store';
import { BackdoorComponent } from '@shared/components/backdoor/backdoor.component';
import { PitchStore } from '@feature/pitch/pitch.store';
import { BallotStore } from '@feature/ballot/ballot.store';
import { pitchInit } from '@shared/models/initValues';

@Component({
  selector: 'mh5-author-profile',
  standalone: true,
  imports: [RouterLink, FormsModule, AuthorConsentComponent, BackdoorComponent],
  templateUrl: './author-profile.component.html',
  styleUrl: './author-profile.component.scss',
})
export class AuthorProfileComponent implements AfterViewInit {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pitchStore = inject(PitchStore);
  ballotStore = inject(BallotStore);

  isRunSomethingVisible = signal<boolean>(true);
  channelName = signal<string>('');
  showConsentPopup = signal(false);
  localStorageService = inject(HydrationService);
  authorDefaultName = AUTHOR_DEFAULT_NAME;

  author = computed(() => this.authorStore.authorLoggedInView());
  topFolio = computed(() => {
    return this.author().authorFolio.folioName ?? 'No folio';
  });

  pitchesKnown = computed(() => this.pitchStore.pitches());
  slatesCast = computed(() => this.ballotStore.slatesAuthored());

  isChannelNameOk = computed<boolean>(() => this.channelName().length >= 3 && this.channelName().length <= 15);
  @ViewChild('newHandleInput') handleInputElement!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (this.handleInputElement && this.handleInputElement.nativeElement) {
      this.handleInputElement.nativeElement.focus();
    }
  }

  exportPitches() {
    const pitches = this.pitchStore.pitchViewsComputed();
    const json = JSON.stringify(pitches);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pitches.json';
    a.click();
  }

  exportFolios() {
    const folios = this.folioStore.folios();
    const json = JSON.stringify(folios);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'folios.json';
    a.click();
  }

  pitchById(pitchId: number): Pitch {
    return this.pitchStore.pitchViewsComputed().find(p => p.id === pitchId) ?? pitchInit;
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
    this.authorStore.updateLoggedInAuthor(currentAuthor.id, updatedAuthorData);
    const newFolio: Folio = {
      id: 0,
      authorId: currentAuthor.id,
      folioName: '@' + this.channelName(),
    };
    this.folioStore.createRootFolio(newFolio);
    if (environment.ianConfig.showLogs) {
      console.log(currentAuthor);
      console.log(updatedAuthorData);
      console.log(newFolio);
    }
  }
}
