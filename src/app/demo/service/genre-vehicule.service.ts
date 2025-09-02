import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenreVehiculeDtos, MesureRequiseDtos } from '../api/genreVehicule';
import { Observable } from 'rxjs';
import { KeyValueCentreDtos } from '../api/keyValues';

@Injectable({
    providedIn: 'root'
})
export class GenreVehiculeService {
  private apiUrl = `${environment.apiUrl}/api/GenreVehicules`;

  constructor(private http: HttpClient) {}

  getGenreVehicules(): Observable<GenreVehiculeDtos[]> {
    return this.http.get<GenreVehiculeDtos[]>(this.apiUrl);
  }

  getVehiculeTypes(): Observable<KeyValueCentreDtos[]> {
    return this.http.get<KeyValueCentreDtos[]>(`${this.apiUrl}/GetVehiculeTypeForLookUp`);
  }

  getEnergies(): Observable<KeyValueCentreDtos[]> {
    return this.http.get<KeyValueCentreDtos[]>(`${this.apiUrl}/GetEnergieForLookUp`);
  }

  getMesureTypes(): Observable<KeyValueCentreDtos[]> {
    return this.http.get<KeyValueCentreDtos[]>(`${this.apiUrl}/GetMesureTypeForLookUp`);
  }

  getMesureRequiseByGenreId(id: number): Observable<MesureRequiseDtos[]> {
    return this.http.get<MesureRequiseDtos[]>(`${this.apiUrl}/GetMesureRequiseByGenreId/${id}`);
  }

  saveMesureRequises(mesureRequises: MesureRequiseDtos[]): Observable<any> {
    return this.http.post(this.apiUrl, mesureRequises);
  }

  exoneration(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Exoneration/${id}`, id);
  }

  export(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Export`, { responseType: 'blob' });
  }
}
