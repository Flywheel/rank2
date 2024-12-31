import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '@feature/author/author.store';
import { FolioStore } from '@feature/folio/folio.store';
import { PitchStore } from '@feature/pitch/pitch.store';
import {
  Asset,
  AssetImporter,
  DataImporter,
  Folio,
  FolioImporter,
  FolioView,
  Pitch,
  PitchView,
  Placement,
  PlacementView,
  SlateMember,
} from '../models/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HydrationService {
  private authorStore = inject(AuthorStore);
  private folioStore = inject(FolioStore);
  private pitchStore = inject(PitchStore);

  delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  authorLoggedIn = this.authorStore.authorLoggedIn;

  slateMembersCastFromFolio(placements: Placement[], pitch: PitchView): SlateMember[] {
    return placements.map(({ id }, index) => ({
      id: 0,
      placementId: id,
      rankOrder: index + 1,
      slateId: pitch.slateId,
    }));
  }

  public async hydrateFolios(authorId: string, theData: DataImporter): Promise<void> {
    const theAuthor = this.authorStore.authorViews().find(f => f.id === authorId);
    if (!theAuthor) {
      console.log('Author not found');
      return;
    }

    const rootFolioId = this.folioStore.folios().find(f => f.authorId === authorId && f.parentFolioId === undefined)?.id;
    if (environment.ianConfig.showLogs) {
      console.log(theAuthor, '; rootFolioId: ', rootFolioId, ' folios: ', this.folioStore.folios());
    }
    const assetsToImport: AssetImporter[] = theData.assets;
    const foliosToImport: FolioImporter[] = theData.folios;
    const foliosPrepared: Folio[] = [];

    for (const folio of foliosToImport) {
      const subFolioId = this.folioStore.folioViewsComputed().find(f => f.folioName === folio.parentFolioName)?.id;
      const parentFolioId = subFolioId ? subFolioId : rootFolioId;
      const folioData: Partial<Folio> = {
        authorId,
        folioName: folio.folioName,
        parentFolioId: parentFolioId,
      };

      const { newFolio } = await this.folioStore.createBranchFolio(folioData);

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
            this.folioStore.createPlacement(placementData);
          } else {
            const assetData: Asset = {
              ...placement,
              authorId,
              mediaType: placement.mediaType,
              sourceId: placement.sourceId,
              id: 0,
            };
            this.folioStore.createPlacementWithAsset(newFolio.id, placement.caption, assetData);
            //  this.folioStore.createPlacementWithAssetRX({ folioId: newFolio.id, caption: placement.caption, assetPrep: assetData });
          }
        }
      }
      foliosPrepared.push(this.folioStore.folioViewSelected());
    }
    //  this.hydrateInitialPitches(authorId);
    await this.delay(100);
    const folioViews = this.folioStore.folioViewsComputed().filter(p => p.authorId === authorId);
    folioViews.forEach(async f => await this.hydratePitchWithPlacement(f));
  }

  async hydratePitchWithPlacement(folioView: FolioView): Promise<void> {
    const pitchInit = {
      name: folioView.folioName,
      description: folioView.folioName,
      authorId: folioView.authorId,
      folioId: folioView.id,
      opens: new Date(),
      closes: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    };
    const pitchPrep = pitchInit as unknown as Pitch; // cast with no ID to create new pitch
    const { newPitch } = await this.pitchStore.createPitchAndSlate(pitchPrep);

    //console.log(newPitch);
    const assetPrep: Asset = {
      id: 0,
      mediaType: 'pitch',
      sourceId: newPitch.id.toLocaleString(),
      authorId: this.authorStore.authorLoggedIn().id,
    };
    this.folioStore.createPlacementWithAsset(folioView.parentFolioId!, folioView.folioName, assetPrep);
    // this.folioStore.createPlacementWithAssetRX({ folioId: folioView.parentFolioId!, caption: folioView.folioName, assetPrep });
  }

  public async hydrateSlates(authorId: string): Promise<void> {
    const pitches = this.pitchStore.pitchViewsComputed().filter(p => p.authorId === authorId);
    console.log(pitches);
    const folios = this.folioStore.folioViewsComputed();

    pitches.forEach(async pitch => {
      const hasFolio = folios.filter(folio => folio.id === pitch.folioId)[0];
      if (hasFolio && hasFolio.placementViews) {
        const members = hasFolio.placementViews ?? ([] as PlacementView[]);
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
      } else {
        console.warn(`Folio with id ${pitch.folioId} not found or has no placement views.`);
      }
    });
  }
}
