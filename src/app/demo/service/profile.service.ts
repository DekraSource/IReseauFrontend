import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { KeyValues } from '../api/keyValues';
import { FilterProfile, PaginatedListProfile, Profile } from '../api/userInterface';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  constructor(private http: HttpClient) { }

  getAll(filtre: FilterProfile): Observable<PaginatedListProfile> {
    let params = new HttpParams();
    params = params.append("pageIndex", filtre.pageIndex);
    params = params.append("pageSize", filtre.pageSize);

    if (filtre.label != undefined) {
      params = params.append("label", filtre.label);
    }

    if (filtre.isEnabled != undefined) {
      if (filtre.isEnabled.length > 0) {
        var sum = filtre.isEnabled.reduce((acc, option) => acc + option.value, 0);
        params = params.append("Enabled", sum);
      }
    } else {
      params = params.append("Enabled", 0);
    }

    return this.http.get<PaginatedListProfile>(environment.apiUrl + '/api/Profile', { params });
  }

  getById(id: number): Observable<Profile> {
    return this.http.get<Profile>(environment.apiUrl + '/api/Profile/' + id);
  }

  add(object: Profile) {
    return this.http.post(environment.apiUrl + '/api/Profile', object);
  }

  update(object: Profile) {
    return this.http.put(environment.apiUrl + '/api/Profile/' + object.Id, object, { observe: 'response' })
      .pipe(
        tap(response => {
        }),
        catchError((error: any) => {
          console.error('PUT request failed', error);
          return throwError(error);
        })
      );
  }

  delete(id: number) {
    return this.http.delete(environment.apiUrl + '/api/Profile/' + id);
  }

  GetKeyValueItemsProfile(): Observable<KeyValues[]> {
    return this.http.get<KeyValues[]>(environment.apiUrl + '/api/Profile/GetKeyValueItems');
  }

  uploadGuidePdf(file: Blob): Observable<string> {
    let formParams = new FormData();
    formParams.append('file', file);
    return this.http.post(environment.apiUrl + '/api/Profile/UploadGuidePdf', formParams, { responseType: 'text' });
  }
  getProfileGuidePdf(profileId: number): Observable<Blob> {
    return this.http.get(environment.apiUrl + `/api/Profile/guide/${profileId}`, { responseType: 'blob' });
  }
  
}
