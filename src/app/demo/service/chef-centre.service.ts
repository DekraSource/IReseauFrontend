// chefcentre.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { KeyValuesDtos } from '../api/keyValues';
import { ChefCentreDtos } from '../api/chefcentre';

@Injectable({
  providedIn: 'root'
})
export class ChefCentreService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<ChefCentreDtos[]> {
    return this.http.get<ChefCentreDtos[]>(`${environment.apiUrl}/api/ChefCentres`);
  }

  getById(id: number): Observable<ChefCentreDtos> {
    return this.http.get<ChefCentreDtos>(`${environment.apiUrl}/api/ChefCentres/${id}`);
  }

  create(agent: ChefCentreDtos): Observable<ChefCentreDtos> {
    return this.http.post<ChefCentreDtos>(`${environment.apiUrl}/api/ChefCentres`, agent);
  }

  update(id: number, agent: ChefCentreDtos): Observable<ChefCentreDtos> {
    return this.http.put<ChefCentreDtos>(`${environment.apiUrl}/api/ChefCentres/${id}`, agent);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/ChefCentres/${id}`);
  }


  getCentresForLookUp(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(`${environment.apiUrl}/api/ChefCentres/GetCentreForLookUp`);
  }
   getNiveauFormationTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/ChefCentres/NiveauFormationTypesForLookUp`);
  }

  export(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/ChefCentres/Export`, { responseType: 'blob' });
  }
}