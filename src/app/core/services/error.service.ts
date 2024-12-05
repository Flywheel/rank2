import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public handleHttpErrorResponse({ status }: HttpErrorResponse, message?: string) {
    message = message || 'Sorry. An error occurred';
    return throwError(() => `${status}:  ${message}`);
  }
  public handleSignalStoreResponse({ status }: any, message?: string) {
    message = message || 'Sorry. An error occurred';
    return throwError(() => `${status}:  ${message}`);
  }
}
