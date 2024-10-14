import { ApplicationConfig, isDevMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DbService } from '../mocks/db.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';

const commonProviders = [
  provideHttpClient(withFetch()),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
  //provideClientHydration(),
  provideAnimationsAsync(),
  provideAnimations(),
];

const inMemoryDbProvidersForProd = [
  importProvidersFrom(InMemoryWebApiModule.forRoot(DbService, { delay: 1, dataEncapsulation: false, passThruUnknownUrl: true })),
];

export const appConfig: ApplicationConfig = {
  providers: [...commonProviders, ...(isDevMode() ? inMemoryDbProvidersForProd : inMemoryDbProvidersForProd), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })],
};
