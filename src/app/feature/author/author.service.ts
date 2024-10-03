import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Author, AuthorView } from '../../core/interfaces/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private authorAPIUrl = 'api/author';
  http = inject(HttpClient);

  authorsGetAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.authorAPIUrl);
  }

  authorGetById(uid: string): Observable<Author> {
    return this.http.get<Author>(`${this.authorAPIUrl}/${uid}`);
  }

  authorViewGetById(uid: string): Observable<AuthorView> {
    return this.http.get<AuthorView>(`${this.authorAPIUrl}/${uid}`);
  }

  authorCreate(author: Author): Observable<Author> {
    if (environment.ianConfig.showLogs) console.log(`authorCreate Start `);
    return this.http.post<Author>(this.authorAPIUrl, { id: author.id, name: author.name, authenticatorId: author.authenticatorId, eventLog: [] }).pipe(
      catchError(this.handleError),
      tap((newAuthor: Author) => {
        if (environment.ianConfig.showLogs) console.log(` addNewAuthorId: ${newAuthor.id}`);
      })
    );
  }

  authorUpdate(authorId: string, authorData: Partial<Author>): Observable<Author> {
    if (environment.ianConfig.showLogs) console.log(`authorUpdate Start authorId=${authorId}`);
    return this.http.patch<Author>(`${this.authorAPIUrl}/${authorId}`, authorData).pipe(
      catchError(this.handleError),
      tap(() => {
        if (environment.ianConfig.showLogs) console.log(`authorUpdate Success authorId=${authorId}`);
      })
    );
  }

  private handleError({ status }: HttpErrorResponse) {
    return throwError(() => `${status} Error occurred`);
  }
}
