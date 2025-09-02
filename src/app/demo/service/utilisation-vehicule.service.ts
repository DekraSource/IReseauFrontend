import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {  UtilisationVehiculeDtos } from '../api/utilisationVehicule';

@Injectable({
    providedIn: 'root'
})
export class UtilisationVehiculeService {
    constructor(private http: HttpClient) {}

    // GET all utilisations
    getAll(): Observable<UtilisationVehiculeDtos[]> {
        return this.http.get<UtilisationVehiculeDtos[]>(environment.apiUrl + '/api/UtilisationVehicules');
    }

    // PUT - update utilisation
    update(utilisationVehicule: UtilisationVehiculeDtos) {
        return this.http.put(environment.apiUrl + '/api/UtilisationVehicules/' + utilisationVehicule.id, utilisationVehicule, { observe: 'response' })
            .pipe(
                tap(response => {
                }),
                catchError((error: any) => {
                    console.error('PUT request failed', error);
                    return throwError(error);
                })
            );
    }
}
