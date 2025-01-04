import { Component, inject } from '@angular/core';
import { AuthorStore } from '@feature/author/author.store';

@Component({
  selector: 'mh5-pitch-help',
  standalone: true,
  imports: [],
  templateUrl: './pitch-help.component.html',
  styleUrl: './pitch-help.component.scss',
})
export class PitchHelpComponent {
  authorStore = inject(AuthorStore);
  closeHelp() {
    this.authorStore.setAuthorNameNoticeFalse();
  }
}
