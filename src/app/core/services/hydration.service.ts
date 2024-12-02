import { inject, Injectable } from '@angular/core';
import { AuthorStore } from '../../feature/author/author.store';
import { FolioStore } from '../../feature/folio/folio.store';
import { PitchStore } from '../../feature/pitch/pitch.store';
import { Asset, AssetImporter, DataImporter, Folio, FolioImporter, Pitch, PitchView, Placement, SlateMember } from '../models/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HydrationService {
  private authorStore = inject(AuthorStore);
  private folioStore = inject(FolioStore);
  private pitchStore = inject(PitchStore);
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

      const { newFolio } = await this.folioStore.folioCreateWithParent(folioData);

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
            await this.folioStore.createPlacement(placementData);
          } else {
            const assetData: Asset = {
              ...placement,
              authorId,
              mediaType: placement.mediaType,
              sourceId: placement.sourceId,
              id: 0,
            };
            await this.folioStore.createPlacementWithAsset(assetData, placement.caption);
          }
        }
      }
      foliosPrepared.push(this.folioStore.folioViewSelected());
    }
    this.hydrateInitialPitches(authorId);
  }

  hydrateInitialPitches(authorId: string) {
    //  const authorId = this.authorLoggedIn.id();
    const folioViews = this.folioStore.folioViewsComputed().filter(p => p.authorId === authorId);
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
      this.pitchStore.createPitch(newPitch);
    });
  }

  //  async hydrateInitialPitches2(authorId: string): Promise<{ newPitch: Pitch; newSlate: Slate }>  {
  //     //  const authorId = this.authorLoggedIn.id();
  //     const folioViews = this.folioStore.folioViewsComputed().filter(p => p.authorId === authorId);
  //     folioViews.forEach(f => {
  //       const pitchPrep = {
  //         name: f.folioName,
  //         description: f.folioName,
  //         authorId,
  //         folioId: f.id,
  //         opens: new Date(),
  //         closes: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  //       };
  //       const pitchPrep2 = pitchPrep as unknown as Pitch; // cast with no ID to create new pitch
  //       const { newPitch, newSlate } = await this.pitchStore.createPitchAndSlate(pitchPrep2);
  //       console.log(newPitch, newSlate);
  //       return {newPitch, newSlate };
  //     });
  //   }

  public async hydrateSlates(authorId: string): Promise<void> {
    const pitches = this.pitchStore.pitchViewsComputed().filter(p => p.authorId === authorId);
    console.log(pitches);
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
