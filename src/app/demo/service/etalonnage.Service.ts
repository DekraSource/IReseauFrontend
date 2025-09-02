// etalonnage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EtalonnageDtos } from '../api/equipement';
import { KeyValuesDtos } from '../api/keyValues';

@Injectable({
  providedIn: 'root'
})
export class EtalonnageService {
  constructor(private http: HttpClient) { }

  getByEquipementId(equipementId: number): Observable<EtalonnageDtos[]> {
    return this.http.get<EtalonnageDtos[]>(environment.apiUrl + '/api/Etalonnages/' + equipementId);
  }

  getInterventionTypesForLookUp(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(environment.apiUrl + '/api/Etalonnages/GetInterventionTypesForLookUp');
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(`${environment.apiUrl}/api/File`, formData, {
      reportProgress: true,
      responseType: 'text' as 'json' // To handle string response
    }).pipe(
      catchError(error => {
        console.error('Upload failed:', error);
        return throwError('File upload failed');
      })
    );
  }

// Similar to Blazor's PutAsJsonAsync
  saveEtalonnage(etalonnage: EtalonnageDtos): Observable<EtalonnageDtos> {
    const url = etalonnage.id 
      ? `${environment.apiUrl}/api/Etalonnages/${etalonnage.id}`
      : `${environment.apiUrl}/api/Etalonnages`;

    return etalonnage.id 
      ? this.http.put<EtalonnageDtos>(url, etalonnage)
      : this.http.post<EtalonnageDtos>(url, etalonnage);
  }

  // For updating with file (like the Blazor version)
  updateWithFile(etalonnage: EtalonnageDtos, file: File): Observable<any> {
    return this.uploadFile(file).pipe(
      map(filePath => {
        etalonnage.rapportIntervention = filePath;
        return this.saveEtalonnage(etalonnage);
      })
    );
  }
  update(etalonnage: EtalonnageDtos, file?: File): Observable<EtalonnageDtos> {
    const formData = new FormData();
    formData.append('etalonnage', JSON.stringify(etalonnage));
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<EtalonnageDtos>(environment.apiUrl + '/api/Etalonnages/' + etalonnage.id, formData);
  }

  delete(id: number) {
    return this.http.delete(environment.apiUrl + '/api/Etalonnages/' + id);
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(environment.apiUrl + '/api/Etalonnages/DownloadFile/' + id, { responseType: 'blob' });
  }
}