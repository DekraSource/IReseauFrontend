import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MarqueVehiculeDtos } from '../api/marqueVehicule';

@Injectable({
    providedIn: 'root'
})
export class MarqueVehiculeService {
    constructor(private http: HttpClient) {}

    // GET all marques
    getAll(): Observable<MarqueVehiculeDtos[]> {
        return this.http.get<MarqueVehiculeDtos[]>(environment.apiUrl + '/api/MarqueVehicules');
    }

    // PUT - update marque
    update(marqueVehicule: MarqueVehiculeDtos) {
        return this.http.put(environment.apiUrl + '/api/MarqueVehicules/' + marqueVehicule.id, marqueVehicule, { observe: 'response' })
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
