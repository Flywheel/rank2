import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '../../feature/author/author.store';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private authorStore = inject(AuthorStore);

  // updateFromStorage(): void {
  //   this.authorStore.readFromStorage(); // reads the stored item from storage and patches the state
  // }

  // updateStorage(): void {
  //   this.authorStore.writeToStorage(); // writes the current state to storage
  // }

  // clearStorage(): void {
  //   this.authorStore.clearStorage(); // clears the stored item in storage
  // }
}
