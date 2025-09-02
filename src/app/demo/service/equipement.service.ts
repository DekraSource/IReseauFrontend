// equipement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipementDtos, LigneDtos } from '../api/equipement';
import { environment } from 'src/environments/environment';
import { KeyValuesDtos } from '../api/keyValues';

@Injectable({
  providedIn: 'root'
})
export class EquipementService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<EquipementDtos[]> {
    return this.http.get<EquipementDtos[]>(environment.apiUrl + '/api/Equipements');
  }
  getAllPourValidation(): Observable<EquipementDtos[]> {
    return this.http.get<EquipementDtos[]>(environment.apiUrl + '/api/Equipements/GetAllPourValidation');
  }

  getById(id: number): Observable<EquipementDtos> {
    return this.http.get<EquipementDtos>(environment.apiUrl + '/api/Equipements/' + id);
  }

  add(equipement: EquipementDtos): Observable<EquipementDtos> {
    return this.http.post<EquipementDtos>(environment.apiUrl + '/api/Equipements', equipement);
  }
  valider(equipementIds:number[]): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/Equipements/Valider', equipementIds);
  }
  update(equipement: EquipementDtos): Observable<EquipementDtos> {
    return this.http.put<EquipementDtos>(environment.apiUrl + '/api/Equipements/' + equipement.id, equipement);
  }

  delete(id: number) {
    return this.http.delete(environment.apiUrl + '/api/Equipements/' + id);
  }

  getLignesForLookUp(): Observable<LigneDtos[]> {
    return this.http.get<LigneDtos[]>(environment.apiUrl + '/api/Equipements/GetLignesForLookUp');
  }

  getTypesForLookUp(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(environment.apiUrl + '/api/Equipements/GetTypesForLookUp');
  }
  getCentresForLookUp(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(environment.apiUrl + '/api/AgentVisiteurs/GetCentreForLookUp');
  }

  export(): Observable<Blob> {
    return this.http.get(environment.apiUrl + '/api/Equipements/Export', { responseType: 'blob' });
  }
}