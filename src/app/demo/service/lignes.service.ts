import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Lignes, KeyValue } from '../api/Lignes';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LignesService {
    private apiUrl = `${environment.apiUrl}/api/Lignes`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Lignes[]> {
        return this.http.get<Lignes[]>(this.apiUrl);
    }

    getById(id: number): Observable<Lignes> {
        return this.http.get<Lignes>(`${this.apiUrl}/${id}`);
    }

    create(ligne: Partial<Lignes>): Observable<Lignes> {
        return this.http.post<Lignes>(this.apiUrl, ligne);
    }

    update(id: number, ligne: Partial<Lignes>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, ligne);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getCentreForLookUp(): Observable<KeyValue[]> {
        return this.http.get<KeyValue[]>(`${this.apiUrl}/GetCentreForLookUp`);
    }

    getStatutForLookUp(): Observable<KeyValue[]> {
        return this.http.get<KeyValue[]>(`${this.apiUrl}/GetStatutForLookUp`);
    }

    getTypeForLookUp(): Observable<KeyValue[]> {
        return this.http.get<KeyValue[]>(`${this.apiUrl}/GetTypeForLookUp`);
    }
}
