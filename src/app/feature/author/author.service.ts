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
    return this.http.post<Author>(this.authorAPIUrl, { id: author.id, name: author.name }).pipe(
      catchError(this.handleError),
      tap((newAuthor: Author) => {
        if (environment.ianConfig.showLogs) console.log(` addNewAuthorId: ${newAuthor.id}`);
      })
    );
  }

  authorUpdate(authorId: string, authorData: Partial<Author>): Observable<Author> {
    if (environment.ianConfig.showLogs) {
      console.log(`authorUpdate Start authorId=${authorId}`);
      console.log(authorData);
    }
    const theAuthor = { id: authorId, ...authorData };
    if (environment.ianConfig.showLogs) console.log(theAuthor);
    return this.http.put<Author>(`${this.authorAPIUrl}/${authorId}`, theAuthor).pipe(
      catchError(this.handleError),
      tap((updatedAuthor: Author) => {
        if (environment.ianConfig.showLogs) console.log(`author result = ${updatedAuthor}`);
      })
    );
  }

  //updateAuthor(author: Author): Promise<Author> {
  // async authorUpdate(authorId: string, authorData: Partial<Author>): Promise<Author> {
  //   const theAuthor = { id: authorId, ...authorData };
  //   return new Promise((resolve, reject) => {
  //     this.http.put<Author>(`${this.authorAPIUrl}/${authorId}`, theAuthor).subscribe({
  //       next: data => {
  //         if (environment.ianConfig.showLogs) console.log(`authorUpdate ${data}`);
  //         resolve(data);
  //       },
  //       error: error => {
  //         if (environment.ianConfig.showLogs) console.error('getAllAuthors Error:', error);
  //         reject(error);
  //       },
  //     });
  //   });
  // }

  private handleError({ status }: HttpErrorResponse) {
    return throwError(() => `${status} Error occurred`);
  }
}
