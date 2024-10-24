import { Injectable } from '@angular/core';
import { InMemoryDbService, ResponseOptions } from 'angular-in-memory-web-api';
import {
  Asset,
  Author,
  Pitch,
  PitchView,
  Folio,
  FolioView,
  Placement,
  PlacementView,
  Slate,
  SlateMember,
} from '../app/core/models/interfaces';
import { Observable } from 'rxjs';
import {
  assetInit,
  authorInit,
  folioInit,
  folioViewInit,
  pitchInit,
  pitchViewInit,
  placementInit,
  placementViewInit,
  slateInit,
  slateMemberInit,
} from '../app/core/models/initValues';

@Injectable({
  providedIn: 'root',
})
export class DbService implements InMemoryDbService {
  author: Author[] = [authorInit];
  pitch: Pitch[] = [pitchInit];
  pitchView: PitchView[] = [pitchViewInit];
  slate: Slate[] = [slateInit];
  slatemember: SlateMember[] = [slateMemberInit];
  asset: Asset[] = [assetInit];
  folio: Folio[] = [folioInit];
  folioview: FolioView[] = [folioViewInit];
  placement: Placement[] = [placementInit];
  placementview: PlacementView[] = [placementViewInit];

  createDb() {
    return {
      author: this.author,
      pitch: this.pitch,
      slate: this.slate,
      slatemember: this.slatemember,
      pitchView: this.pitchView,
      folio: this.folio,
      folioview: this.folioview,
      placement: this.placement,
      placementview: this.placementview,
      asset: this.asset,
    };
  }

  put(reqInfo: any): Observable<Response> | undefined {
    return reqInfo.utils.createResponse$(() => {
      const id = reqInfo.id; // Keep ID as string to handle both numbers and UIDs
      const updatedEntity = reqInfo.utils.getJsonBody(reqInfo.req); // Generic entity
      const collection = reqInfo.collection as { id: number | string }[]; // Collection of objects with either number or string 'id'

      // Validate ID (check if it's a valid number or non-empty string for UIDs)
      if (!id || (typeof id === 'string' && id.trim() === '')) {
        const options: ResponseOptions = {
          body: { error: `Invalid ${reqInfo.collectionName} ID` },
          status: 400,
        };
        return this.finishOptions(options, reqInfo);
      }

      // Find the entity in the collection by comparing 'id' (handles both numeric and string IDs)
      const index = collection.findIndex(item => item.id === id);
      if (index > -1) {
        collection[index] = updatedEntity;
        const options: ResponseOptions = {
          body: updatedEntity,
          status: 200,
        };
        return this.finishOptions(options, reqInfo);
      } else {
        const options: ResponseOptions = {
          body: { error: `${reqInfo.collectionName} not found` },
          status: 404,
        };
        return this.finishOptions(options, reqInfo);
      }
    });
  }

  private finishOptions(options: ResponseOptions, reqInfo: any): ResponseOptions {
    // Set the status text based on the status code
    options.statusText = options.status === 200 ? 'OK' : options.status === 404 ? 'Not Found' : 'Error';

    // Check if reqInfo contains headers and url before assigning
    options.headers = reqInfo.headers ? reqInfo.headers : new Headers();
    options.url = reqInfo.url ? reqInfo.url : '';

    return options;
  }
}
