// equipement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyValuesDtos } from '../api/keyValues';
import { FormationDto } from '../api/formation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl =  `${environment.apiUrl}/api/formations`;

  constructor(private http: HttpClient) { }

  getAllForChefCentre(): Observable<FormationDto[]> {
    return this.http.get<FormationDto[]>(this.apiUrl+"/GetAllForChefCentre");
  }
  getAllForAgentVisiteur(): Observable<FormationDto[]> {
    return this.http.get<FormationDto[]>(this.apiUrl+"/GetAllForAgentVisiteur");
  }
  getChefCentres(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(`${this.apiUrl}/GetChefCentreForLookUp`);
  }

  getAgentVisiteurs(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(`${this.apiUrl}/GetAgentVisiteurForLookUp`);
  }

  getFormationTypes(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(`${this.apiUrl}/GetFormationTypeForLookUp`);
  }

  createFormation(formation: any): Observable<any> {
    return this.http.post(this.apiUrl, formation);
  }

  updateFormation(id: number, formation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formation);
  }

  deleteFormation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

 verifyImport(data: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/VerficationImportExcel`, data);
  }

  importFormations(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ImportExcel`, data);
  }
}