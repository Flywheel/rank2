import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Author, AuthorView } from '../../core/interfaces/interfaces';
import { environment } from '../../../environments/environment';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private authorAPIUrl = 'api/authors';

  http = inject(HttpClient);

  authorCreate(authenticatorId: string): Observable<Author> {
    if (environment.ianConfig.showLogs) console.log(`authorCreate Start authenticatorId=${authenticatorId}`);
    return this.http.post<Author>(this.authorAPIUrl, { name: '', authenticatorId, topicId: 0 }).pipe(
      catchError(this.handleError),
      tap((newAuthor: Author) => {
        if (environment.ianConfig.showLogs) console.log(` addNewAuthorId: ${newAuthor.id}`);
      })
    );
  }

  authorGetById(uid: string): Observable<Author> {
    return this.http.get<Author>(`${this.authorAPIUrl}/${uid}`).pipe(takeUntilDestroyed());
  }

  authorViewGetById(uid: string): Observable<AuthorView> {
    return this.http.get<AuthorView>(`${this.authorAPIUrl}/${uid}`).pipe(takeUntilDestroyed());
  }

  private handleError({ status }: HttpErrorResponse) {
    return throwError(() => `${status}: Something bad happened.`);
  }
}
