import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ReaffectationAgentVisiteurDtos } from '../api/reaffectationAgentVisiteur';
import { KeyValueCentreDtos, KeyValuesDtos } from '../api/keyValues';

@Injectable({
  providedIn: 'root'
})

export class ReaffectationAgentVisiteurService {
    constructor(private http: HttpClient) { }

  getAll(): Observable<ReaffectationAgentVisiteurDtos[]> {
    return this.http.get<ReaffectationAgentVisiteurDtos[]>(environment.apiUrl + '/api/ReaffectationAgentVisiteurs');
  }

  getById(id:number): Observable<ReaffectationAgentVisiteurDtos> {
    return this.http.get<ReaffectationAgentVisiteurDtos>(environment.apiUrl + '/api/ReaffectationAgentVisiteurs/'+id);
  }

  create(reaffectationAgentVisiteur:ReaffectationAgentVisiteurDtos) {
    return this.http.post(environment.apiUrl + '/api/ReaffectationAgentVisiteurs',reaffectationAgentVisiteur);
  }

  update(id:number,reaffectationAgentVisiteur:ReaffectationAgentVisiteurDtos){
    return this.http.put(environment.apiUrl + '/api/ReaffectationAgentVisiteurs/'+id,reaffectationAgentVisiteur, { observe: 'response' })
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
    return this.http.delete(environment.apiUrl + '/api/ReaffectationAgentVisiteurs/'+id);
  }
   getCentreForLookUp(): Observable<KeyValueCentreDtos[]> {
    return this.http.get<KeyValueCentreDtos[]>(environment.apiUrl + '/api/ChefCentres/GetCentreForLookUp');
  }
// New method to get agents for lookup
    getAgentVisiteursByCentre(centreId: number): Observable<KeyValueCentreDtos[]> {
    return this.http.get<KeyValueCentreDtos[]>(environment.apiUrl + '/api/ReaffectationAgentVisiteurs/getAgentVisiteursByCentre/'+centreId);
  }
}
