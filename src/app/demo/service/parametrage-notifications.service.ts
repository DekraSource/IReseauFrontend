// agent-visiteur.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParametrageNotification } from '../api/parametrageNotification';

@Injectable({
  providedIn: 'root'
})
export class ParametrageNotificationsService {
constructor(private http: HttpClient) {}


getAll(): Observable<ParametrageNotification[]> {
return this.http.get<ParametrageNotification[]>(`${environment.apiUrl}/api/ParametrageNotifications`);
}


getById(id: number): Observable<ParametrageNotification> {
return this.http.get<ParametrageNotification>(`${environment.apiUrl}/api/ParametrageNotifications/${id}`);
}


create(item: ParametrageNotification): Observable<ParametrageNotification> {
return this.http.post<ParametrageNotification>(`${environment.apiUrl}/api/ParametrageNotifications`, item);
}


update(id: number, item: ParametrageNotification): Observable<ParametrageNotification> {
return this.http.put<ParametrageNotification>(`${environment.apiUrl}/api/ParametrageNotifications/${id}`, item);
}


delete(id: number): Observable<void> {
return this.http.delete<void>(`${environment.apiUrl}/api/ParametrageNotifications/${id}`);
}
}