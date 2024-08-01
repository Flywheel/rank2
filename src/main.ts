import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';

async function prepareApp() {
  try {
    //   if (isDevMode()) {
    const { worker: mockData } = await import('./mocks/browser');
    return mockData.start();
    //   }
  } catch (error) {
    console.error('Failed to start Mock Service Worker:', error);
  }
  return Promise.resolve();
}

prepareApp().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
});
