import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  public enabled = false;

  enableLogging(): void {
    this.enabled = true;
  }

  disableLogging(): void {
    this.enabled = false;
  }
}
