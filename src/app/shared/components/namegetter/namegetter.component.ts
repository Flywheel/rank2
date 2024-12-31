import { Component, computed, inject, signal } from '@angular/core';
import { IconProfileComponent } from '../../svg/icon-profile';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '@feature/author/author.store';
import { FolioStore } from '@feature/folio/folio.store';
import { Author, Folio } from '../../models/interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mh5-namegetter',
  standalone: true,
  imports: [IconProfileComponent, FormsModule],
  templateUrl: './namegetter.component.html',
  styleUrl: './namegetter.component.scss',
})
export class NamegetterComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  channelName = signal<string>('');
  dupeNameFound = computed<boolean>(() => this.authorStore.authorViews().find(a => a.name === this.channelName()) !== undefined);
  meetsRequirements = computed(() => this.channelName().length > 4 && this.channelName().substring(0, 1) !== '@');
  disallowPost = computed(() => !this.meetsRequirements() || this.dupeNameFound());

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
  }
}
