import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';

async function prepareApp() {
  try {
    if (isDevMode()) {
      const { worker: mockDataWorker } = await import('./mocks/browser');
      console.log('Starting Mock Service Worker');
      return mockDataWorker.start();
    } else {
      console.log('No data service yet provided');
    }
  } catch (error) {
    console.error('Did not start Mock Service Worker:', error);
  }
  return Promise.resolve();
}

prepareApp().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
});
