// in-memory-data.module.ts
import { NgModule } from '@angular/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DbService } from '../mocks/db.service';

@NgModule({
  imports: [
    HttpClientInMemoryWebApiModule.forRoot(DbService, {
      delay: 1,
      dataEncapsulation: false,
      passThruUnknownUrl: true,
    }),
  ],
})
export class InMemoryDataModule {}
