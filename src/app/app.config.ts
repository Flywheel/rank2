import { ApplicationConfig, isDevMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DbService } from '../mocks/db.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const fortytwo = 'mmm';

const commonProviders = [
  provideHttpClient(withFetch()),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
  provideClientHydration(),
];

const inMemoryDbProviders = [importProvidersFrom(InMemoryWebApiModule.forRoot(DbService, { delay: 1, dataEncapsulation: false, passThruUnknownUrl: true }))];

const mswProviders = [provideAnimationsAsync(), provideAnimations()];

//const allProviders = [...commonProviders, ...inMemoryDbProviders, ...mswProviders];

export const appConfig: ApplicationConfig = {
  // providers: [...allProviders],
  providers: [...commonProviders, ...(isDevMode() ? mswProviders : inMemoryDbProviders)],
};
