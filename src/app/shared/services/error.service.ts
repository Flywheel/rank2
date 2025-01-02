import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  handleHttpErrorResponse({ status }: HttpErrorResponse, message?: string) {
    if (environment.ianConfig.showLogs) console.error(`${status}:  ${message}`);
    message = message || 'Sorry. An error occurred';
    this.errorSignal.set(message);
    return throwError(() => `${status}:  ${message}`);
  }

  handleSignalStoreResponse({ status }: any, message?: string) {
    console.error('store: ', message, status);
    message = message || 'Sorry. An error occurred';
    //  this.errorSignal.set(message.toString());
    return throwError(() => `${status}:  ${message}`);
  }

  private errorSignal = signal<string | null>(null);

  get error() {
    return this.errorSignal();
  }

  setError(message: string | null) {
    this.errorSignal.set(message);
  }
  clearError() {
    this.setError(null);
  }
}
