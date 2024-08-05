import { Injectable } from '@angular/core';
import { InMemoryDbService, ParsedRequestUrl, RequestInfoUtilities, ResponseOptions, RequestInfo } from 'angular-in-memory-web-api';
import { Author, ContestView } from '../app/core/interfaces/interfaces';
//import { LoggingService } from '../../core/logging/logging.service';
import { contestViewList } from './mockdata';

@Injectable({
  providedIn: 'root',
})
export class DbService implements InMemoryDbService {
  mockData = contestViewList;

  //   parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
  //     let newUrl = url;
  //     if (url.includes('/authors/authenticatorid/')) {
  //       newUrl = url.replace(/\/authors\/authenticatorid\/(.*)$/, '/authors/?authenticatorId=$1');
  //     }

  //     if (url.includes('/authors/name/')) {
  //       newUrl = url.replace(/\/authors\/name\/([^/]*)$/, '/authors/?name=$1');
  //     }
  //     const parsed = utils.parseRequestUrl(newUrl);
  //     return parsed;
  //   }

  createDb() {
    const contestViews: ContestView[] = this.mockData;
    console.log(`contestViews ${contestViews.length} ${contestViews}`);
    return { contestViews };
  }

  //   responseInterceptor(resOptions: ResponseOptions, reqInfo: RequestInfo) {
  //     if (reqInfo.method === 'put' && reqInfo.collectionName === 'authors') {
  //       const db = reqInfo.utils.getDb() as MyDb;
  //       resOptions.body = db.authors.find((author: Author) => author.id === reqInfo.id);
  //     }
  //     return resOptions;
  //   }
}
// interface MyDb {
//   authors: Author[];
// }
