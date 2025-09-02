import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GridData, GridQuery, ListControlesDtos, ListTokensDtos } from '../api/listControles';
import { KeyValueCentreDtos } from '../api/keyValues';


@Injectable({
  providedIn: 'root'
})
export class ListControlesService {
  private apiUrl = `${environment.apiUrl}/api/ListControles`;

  constructor(private http: HttpClient) {}

  // Get centers for lookup
  getCentres(): Observable<KeyValueCentreDtos[]> {
    return this.http.get<KeyValueCentreDtos[]>(`${environment.apiUrl}/api/AgentVisiteurs/GetCentreForLookUp`);
  }

  // Get paginated list of controls
  getControls(query: GridQuery): Observable<GridData<ListControlesDtos>> {
    return this.http.post<GridData<ListControlesDtos>>(`${this.apiUrl}/GetData`, query);
  }

  // Get tokens by control ID
  getTokensByControlId(controlId: number): Observable<ListTokensDtos[]> {
    return this.http.get<ListTokensDtos[]>(`${this.apiUrl}/GetByTokenId/${controlId}`);
  }

  // Cancel a control
  cancelControl(controlId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/RazControle/${controlId}`, {});
  }

  // Update control type
  updateControlType(controlId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/UpdateTypeControle/${controlId}`, {});
  }

  // Copy scripts to clipboard (moved to component as it's UI related)
  // getScriptsForCopy(token: string, numeroLiass: string): string {
  //   return `...`;
  // }
}