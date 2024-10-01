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
  private authorAPIUrl = 'api/author';

  http = inject(HttpClient);

  authorCreate(uuid: string): Observable<Author> {
    if (environment.ianConfig.showLogs) console.log(`authorCreate Start authenticatorId=${uuid}`);
    return this.http.post<Author>(this.authorAPIUrl, { id: uuid }).pipe(
      catchError(this.handleError),
      tap((newAuthor: Author) => {
        if (environment.ianConfig.showLogs) console.log(` addNewAuthorId: ${newAuthor.id}`);
      })
    );
  }

  authorUpdate(author: Author): Observable<Author> {
    if (environment.ianConfig.showLogs) console.log(`authorUpdate Start authorId=${author.id}`);
    return this.http.put<Author>(`${this.authorAPIUrl}/${author.id}`, author).pipe(
      catchError(this.handleError),
      tap(() => {
        if (environment.ianConfig.showLogs) console.log(`authorUpdate Success authorId=${author.id}`);
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
