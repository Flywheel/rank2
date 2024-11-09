import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { FolioStore } from '../folio.store';
import { AuthorView, FolioView } from '../../../core/models/interfaces';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-folio-scroll-horizontal',
  standalone: true,
  imports: [],
  templateUrl: './folio-scroll-horizontal.component.html',
  styleUrl: './folio-scroll-horizontal.component.scss',
})
export class FolioScrollHorizontalComponent {
  folioStore = inject(FolioStore);
  authorStore = inject(AuthorStore);

  theFoliosInput = input<FolioView[]>();
  knownAuthors = input<AuthorView[]>();

  firstFolioId = computed<number>(() => this.theFoliosInput()?.[0]?.id ?? 0);

  constructor() {
    effect(() => {
      const folioId = this.firstFolioId();
      if (folioId > 0) {
        untracked(() => this.selectFolio(folioId));
      }
    });
  }

  selectFolio(id: number) {
    this.folioStore.setFolioSelected(id);
  }
  selectAuthor(id: string) {
    this.authorStore.authorSelectedSetById(id);
  }
}
