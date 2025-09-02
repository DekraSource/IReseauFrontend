// src/app/notification.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EquipementControleDtos, TableauBordDtos } from '../api/tableauBord';
import { EquipementDtos } from '../api/equipement';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService  {

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<TableauBordDtos> {
    return this.http.get<TableauBordDtos>(environment.apiUrl+'/api/TableauBords');
  }

  getEquipements(): Observable<EquipementDtos[]> {
    return this.http.get<EquipementDtos[]>(environment.apiUrl+'/api/Equipements');
  }

  getEquipementControles(): Observable<EquipementControleDtos[]> {
    return this.http.get<EquipementControleDtos[]>(environment.apiUrl+'/api/TableauBords/GetEquipementControles');
  }

  exportEquipementControles(): Observable<Blob> {
    return this.http.get(environment.apiUrl+'/api/TableauBords/ExportEquipementControles', { responseType: 'blob' });
  }
}
