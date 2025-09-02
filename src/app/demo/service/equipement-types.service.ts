import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {EquipementType} from "../api/equipementTypes";


@Injectable({
    providedIn: 'root'
})
export class EquipementTypeService {
    private apiUrl = `${environment.apiUrl}/api/EquipementTypes`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<EquipementType[]> {
        return this.http.get<EquipementType[]>(this.apiUrl);
    }
}
