import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  public enabled = environment.ianConfig.hideLogs;

  enableLogging(): void {
    this.enabled = true;
  }

  disableLogging(): void {
    this.enabled = false;
  }
}
