import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CarburantVehiculeDtos } from '../api/carburantvehicule';

@Injectable({
  providedIn: 'root'
})

export class CarburantVehiculeService {
    constructor(private http: HttpClient) { }

  getAll(): Observable<CarburantVehiculeDtos> {
    return this.http.get<CarburantVehiculeDtos>(environment.apiUrl + '/api/CarburantVehicules');
  }

  getById(id:number): Observable<CarburantVehiculeDtos> {
    return this.http.get<CarburantVehiculeDtos>(environment.apiUrl + '/api/CarburantVehicules/'+id);
  }

  add(carburantVehicule:CarburantVehiculeDtos) {
    return this.http.post(environment.apiUrl + '/api/CarburantVehicules',carburantVehicule);
  }

  update(carburantVehicule:CarburantVehiculeDtos){
    return this.http.put(environment.apiUrl + '/api/CarburantVehicules/'+carburantVehicule.id,carburantVehicule, { observe: 'response' })
    .pipe(
      tap(response => {
      }),
      catchError((error: any) => {
        console.error('PUT request failed', error);
        return throwError(error);
      })
    );
  }

  delete(id:number) {
    return this.http.delete(environment.apiUrl + '/api/CarburantVehicules/'+id);
  }
  


}
