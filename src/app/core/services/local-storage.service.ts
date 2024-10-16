import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { ContestStore } from '../../feature/contest/contest.store';
import { theData } from '../../../mocks/data-from-store.service';
import { Folio } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private authorStore = inject(AuthorStore);
  private folioStore = inject(FolioStore);
  private pitchStore = inject(ContestStore);

  updateFromStorage(): void {
    this.authorStore.readFromStorage(); // reads the stored item from storage and patches the state
    this.folioStore.readFromStorage();
    this.pitchStore.readFromStorage();
  }

  updateStorage(): void {
    this.authorStore.writeToStorage(); // writes the current state to storage
    this.folioStore.writeToStorage();
    this.pitchStore.writeToStorage();
  }

  clearStorage(): void {
    this.authorStore.clearStorage(); // clears the stored item in storage
    this.folioStore.clearStorage();
    this.pitchStore.clearStorage();
  }

  public async hydarateStuff(): Promise<void> {
    theData.assets.forEach(asset => {
      this.folioStore.assetCreate(asset);
    });

    const theFolios: Folio[] = theData.folios;
    theFolios.forEach(folio => {
      //console.log(folio);
      const parentId = folio.parentFolioId;
      if (parentId !== undefined) {
        this.folioStore.folioCreateWithParent(folio);
      } else {
        this.folioStore.folioCreateForNewAuthor(folio);
      }
    });

    theData.placements.forEach(placement => {
      this.folioStore.placementCreate(placement);
    });
  }
}
