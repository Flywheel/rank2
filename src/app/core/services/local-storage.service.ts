import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { BallotStore } from '../../feature/ballot/ballot.store';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private authorStore = inject(AuthorStore);
  private folioStore = inject(FolioStore);
  private ballotStore = inject(BallotStore);

  updateFromStorage(): void {
    this.authorStore.readFromStorage(); // reads the stored item from storage and patches the state
    this.folioStore.readFromStorage();
    this.ballotStore.readFromStorage();
  }

  updateStorage(): void {
    this.authorStore.writeToStorage(); // writes the current state to storage
    this.folioStore.writeToStorage();
    this.ballotStore.writeToStorage();
  }

  clearStorage(): void {
    this.authorStore.clearStorage(); // clears the stored item in storage
    this.folioStore.clearStorage();
    this.ballotStore.clearStorage();
  }
}
