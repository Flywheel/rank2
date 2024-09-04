import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

async function prepareApp() {
  if (!environment.ianConfig.hideLogs) {
    console.log('Preparing App');
  }

  return Promise.resolve();
}

prepareApp().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
});
