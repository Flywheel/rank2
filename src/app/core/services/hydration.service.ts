import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { ContestStore } from '../../feature/contest/contest.store';
import { theData } from '../../../mocks/data-from-store3';
import { Asset, AssetImporter, Folio, FolioImporter, Placement } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class HydrationService {
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

  public async hydrateStuff(): Promise<void> {
    const authorId = this.authorStore.authorLoggedIn().id;
    const rootFolioId = this.authorStore.authorChannelViews().filter(f => f.id === authorId)[0].authorFolio.id;
    const assetsToImport: AssetImporter[] = theData.assets;

    const foliosToImport: FolioImporter[] = theData.folios;
    for (const folio of foliosToImport) {
      const subFolioId = this.folioStore.folioViewsComputed().find(f => f.folioName === folio.parentFolioName)?.id;
      const parentFolioId = subFolioId ? subFolioId : rootFolioId;
      const folioData: Partial<Folio> = {
        authorId,
        folioName: folio.folioName,
        parentFolioId: parentFolioId,
      };

      const { newFolio, newAsset, newPlacement } = await this.folioStore.folioCreateWithParent(folioData);
      this.folioStore.setFolioSelected(newFolio.id!);

      const folioAssets: AssetImporter[] = assetsToImport.filter(a => a.folioName === folioData.folioName);

      for (const placement of folioAssets) {
        if (placement.folioName === folioData.folioName) {
          if (placement.mediaType === 'Caption') {
            const placementData: Placement = {
              caption: placement.caption,
              folioId: newFolio.id,
              authorId,
              assetId: 1,
              id: 0,
            };
            await this.folioStore.placementCreate(placementData);
          } else {
            const assetData: Asset = {
              ...placement,
              authorId,

              id: 0,
            };
            await this.folioStore.assetCreateWithPlacement(assetData, placement.caption);
          }
        }
      }
    }
  }
}
