import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Author, Folio } from '@shared/models/interfaces';
import { AuthorStore } from '../author.store';
import { FolioStore } from '../../folio/folio.store';

@Component({
  selector: 'mh5-author-inputs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './author-inputs.component.html',
  styleUrl: './author-inputs.component.scss',
})
export class AuthorInputsComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  channelName = signal<string>('');
  dupeNameFound = computed<boolean>(() => this.authorStore.authorViews().find(a => a.name === this.channelName()) !== undefined);
  failsRequirements = computed(() => this.channelName().length < 6);
  allowPost = computed(() => !this.dupeNameFound() && !this.failsRequirements());

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
      console.log('Author updated: ', updatedAuthorData);
      console.log('New folio created: ', newFolio);
    }
  }
}
