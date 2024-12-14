import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, retry, tap, timeout } from 'rxjs';
import { Author, AuthorView } from '../../core/models/interfaces';
import { environment } from '../../../environments/environment';
import { ErrorService } from '../../core/services/error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  http = inject(HttpClient);
  errorService = inject(ErrorService);
  handleError = this.errorService.handleHttpErrorResponse;
  private authorAPIUrl = 'api/author';

  authorCreate(author: Author): Observable<Author> {
    return this.http.post<Author>(this.authorAPIUrl, { id: author.id, name: author.name }).pipe(
      timeout(2500),
      retry(2),
      tap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
      }),
      catchError(error => this.handleError(error, 'Author creation failed'))
    );
  }

  authorUpdate(authorId: string, authorData: Author): Observable<Author> {
    const endPoint = `${this.authorAPIUrl}/${authorId}`;

    if (environment.ianConfig.showLogs) console.log(authorData);
    return this.http.put<Author>(endPoint, authorData).pipe(
      timeout(2500),
      retry(2),
      tap(data => {
        if (environment.ianConfig.showLogs) console.log('data', data);
      }),
      catchError(error => this.handleError(error, 'Author Update failed'))
    );
  }

  authorsGetAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.authorAPIUrl);
  }

  authorGetById(uid: string): Observable<Author> {
    return this.http.get<Author>(`${this.authorAPIUrl}/${uid}`);
  }

  authorViewGetById(uid: string): Observable<AuthorView> {
    return this.http.get<AuthorView>(`${this.authorAPIUrl}/${uid}`);
  }
}
