import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { PitchStore } from '../../feature/pitch/pitch.store';
//import { theData } from '../../../mocks/mockdataForHydration';
import { Asset, AssetImporter, Folio, FolioImporter, Pitch, PitchView, Placement, SlateMember } from '../models/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HydrationService {
  private authorStore = inject(AuthorStore);
  private folioStore = inject(FolioStore);
  private pitchStore = inject(PitchStore);
  authorLoggedIn = this.authorStore.authorLoggedIn;

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

  slateMembersCastFromFolio(placements: Placement[], pitch: PitchView): SlateMember[] {
    return placements.map(({ id }, index) => ({
      id: 0,
      placementId: id,
      rankOrder: index + 1,
      slateId: pitch.slateId,
    }));
  }

  public async hydrateFolios(authorId: string, theData: any): Promise<void> {
    //const authorId = this.authorLoggedIn().id;
    const rootFolioId = this.authorStore.authorViews().filter(f => f.id === authorId)[0].authorFolio.id;
    const assetsToImport: AssetImporter[] = theData.assets;
    const foliosToImport: FolioImporter[] = theData.folios;
    // const placementPrepared: Placement = placementInit;
    const foliosPrepared: Folio[] = [];

    for (const folio of foliosToImport) {
      const subFolioId = this.folioStore.folioViewsComputed().find(f => f.folioName === folio.parentFolioName)?.id;
      const parentFolioId = subFolioId ? subFolioId : rootFolioId;
      const folioData: Partial<Folio> = {
        authorId,
        folioName: folio.folioName,
        parentFolioId: parentFolioId,
      };

      const { newFolio, newAsset, newPlacement } = await this.folioStore.folioCreateWithParent(folioData);
      if (environment.ianConfig.showLogs) {
        console.log(newFolio.id, ' ', newAsset.id, ' ', newPlacement.id);
      }
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
              mediaType: placement.mediaType,
              sourceId: placement.sourceId,
              id: 0,
            };
            await this.folioStore.assetCreateWithPlacement(assetData, placement.caption);
          }
        }
      }
      foliosPrepared.push(this.folioStore.folioViewSelected());
    }
    this.hydratePitches(authorId);
  }

  hydratePitches(authorId: string) {
    //  const authorId = this.authorLoggedIn.id();
    const folioViews = this.folioStore.folioViewsComputed();
    folioViews.forEach(f => {
      const pitchPrep = {
        name: f.folioName,
        description: f.folioName,
        authorId,
        folioId: f.id,
        opens: new Date(),
        closes: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      };
      const newPitch = pitchPrep as unknown as Pitch; // cast with no ID to create new pitch
      this.pitchStore.pitchCreate(newPitch);
    });
  }

  public async hydrateSlates(): Promise<void> {
    const pitches = this.pitchStore.pitchViewsComputed().filter(p => p.id > 0);
    const folios = this.folioStore.folioViewsComputed();

    pitches.forEach(pitch => {
      const hasFolio = folios.filter(folio => folio.id === pitch.folioId)[0];
      const members = hasFolio.placementViews;
      const newMembers: SlateMember[] = [];
      const theSlateMembersPrep = this.slateMembersCastFromFolio(members, pitch);
      theSlateMembersPrep.forEach(slateMember => {
        const member = {
          slateId: slateMember.slateId,
          placementId: slateMember.placementId,
          rankOrder: slateMember.rankOrder,
        } as SlateMember;
        newMembers.push(member);
      });

      this.pitchStore.addSlateMembers(newMembers);
    });
  }
}
