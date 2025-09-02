import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { KeyValues } from '../api/keyValues';
import { FilterUserClient, PaginatedListUserClient, UserClient } from '../api/userInterface';

@Injectable({
  providedIn: 'root'
})
export class UserClientService {
  constructor(private http: HttpClient) { }

  getAll(filtre: FilterUserClient): Observable<PaginatedListUserClient> {
    let params = new HttpParams()
      .append("pageIndex", filtre.pageIndex)
      .append("pageSize", filtre.pageSize);

    if (filtre.idUser != undefined) {
      params = params.append("idUser", filtre.idUser);
    }

    if (filtre.idClient != undefined) {
      params = params.append("idClient", filtre.idClient);
    }

    return this.http.get<PaginatedListUserClient>(environment.apiUrl + '/api/UserClient', { params });
  }

  getById(id: number): Observable<UserClient> {
    return this.http.get<UserClient>(environment.apiUrl + '/api/UserClient/' + id);
  }

  add(object: UserClient): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/UserClient', object, { observe: 'response' })
      .pipe(
        tap(response => {
        }),
        catchError((error: any) => {
          console.error('POST request failed', error);
          return throwError(error);
        })
      );
  }

  update(object: UserClient): Observable<any> {
    return this.http.put(environment.apiUrl + '/api/UserClient/' + object.Id, object, { observe: 'response' })
      .pipe(
        tap(response => {
        }),
        catchError((error: any) => {
          console.error('PUT request failed', error);
          return throwError(error);
        })
      );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/api/UserClient/' + id, { observe: 'response' })
      .pipe(
        tap(response => {
        }),
        catchError((error: any) => {
          console.error('DELETE request failed', error);
          return throwError(error);
        })
      );
  }

  getKeyValueItems(): Observable<KeyValues[]> {
    return this.http.get<KeyValues[]>(environment.apiUrl + '/api/UserClient/GetKeyValueItems');
  }

  // Méthode optionnelle pour récupérer les utilisateurs disponibles
  getAvailableUsers(): Observable<KeyValues[]> {
    return this.http.get<KeyValues[]>(environment.apiUrl + '/api/User/GetKeyValueItems');
  }

}