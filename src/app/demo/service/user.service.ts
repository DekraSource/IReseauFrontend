import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { FilterUser, PaginatedListUser, switchSessionParamDto, User } from '../api/userInterface';
import { ApiService } from './api-service.service';
import { KeyValuesDtos } from '../api/keyValues';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient, private apiService: ApiService) { }

  getAll(filtre: FilterUser): Observable<PaginatedListUser> {
    let params = new HttpParams();
    params = params.append("pageIndex", filtre.pageIndex);
    params = params.append("pageSize", filtre.pageSize);

    if (filtre.input != undefined) {
      params = params.append("input", filtre.input);
    }

    if(filtre.profileId != undefined){
      params = params.append("ProfileId", filtre.profileId);
    }

    if (filtre.isEnabled != undefined) {
      if(filtre.isEnabled.length>0){
        var sum = filtre.isEnabled.reduce((acc, option) => acc + option.value, 0);
        params = params.append("Enabled", sum);
      }
    }else{
      params = params.append("Enabled", 0);
    }

    return this.http.get<PaginatedListUser>(environment.apiUrl + '/api/User',{ params, headers:this.apiService.createAuthorizationHeader()});
  }

  getById(id:string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/User/'+id);
  }



  update(object:User){
    return this.http.put(environment.apiUrl + '/api/User/'+object.id,object, { observe: 'response' })
    .pipe(
      tap(response => {
      }),
      catchError((error: any) => {
        console.error('PUT request failed', error);
        return throwError(error);
      })
    );
  }

  changePassword(object:any){
    return this.http.put(environment.apiUrl + '/api/User/ChangePassword',object, { observe: 'response', headers:this.apiService.createAuthorizationHeader()})
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
    return this.http.delete(environment.apiUrl + '/api/User/'+id);
  }
  
  GetKeyValueItems(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(environment.apiUrl + '/api/User/GetKeyValueItems',{headers:this.apiService.createAuthorizationHeader()});
  }

  GetKeyValueItemsWithProfilId(profileId: any): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(environment.apiUrl + '/api/User/GetKeyValueItemsWithProfilId/'+profileId,{headers:this.apiService.createAuthorizationHeader()});
  }

  GetCentresForUser(userId: string): Observable<any> {
    // let params = new HttpParams();

    // params = params.append("PageIndex", 1);
    // params = params.append("PageSize", 1);

    // if (filtre.regionId != undefined) {
    //   params = params.append("RegionId", filtre.regionId );
    // }

    // if (filtre.typeCentre != undefined) {
    //   params = params.append("TypeCentre", filtre.typeCentre );
    // }
    return this.http.get<any>(environment.apiUrl + '/api/User/GetCentresForUser/'+userId);
  }



  Login(data: any) {
    return this.apiService.postSansHeader(
      environment.apiUrl + '/api/User/Login',
      data
    );
  }


  changeSession(paramDto: switchSessionParamDto) {
    return this.apiService.post(
      environment.apiUrl + '/api/User/ChangeSession/',paramDto
    );
  }

}
