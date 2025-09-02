import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { ErreurDtos } from '../api/erreur';

@Injectable({
    providedIn: 'root',
})
export class ErreurService {

    constructor(private http: HttpClient) { }



    getAll(centreId): Observable<ErreurDtos[]> {
        if (centreId!=undefined) {
            return this.http.get<ErreurDtos[]>(environment.apiUrl + '/api/ErrorMessages/GetAllByCentreId/'+centreId);

        }else { 
            return this.http.get<ErreurDtos[]>(environment.apiUrl + '/api/ErrorMessages/GetAllByCentreId/-1');

        }

    }
    getById(id:number): Observable<ErreurDtos> {
        return this.http.get<ErreurDtos>(environment.apiUrl + '/api/ErrorMessages/'+id);
    }
    

    delete(id:number)  {
        return this.http.delete(environment.apiUrl + '/api/ErrorMessages/'+id);
    }
    
}
   
    
