// agent-visiteur.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AffecterAgentDtos, AgentForCreateDtos, AgentVisiteurDtos } from '../api/agentVisiteur';
import { environment } from 'src/environments/environment';
import { KeyValuesDtos } from '../api/keyValues';

@Injectable({
  providedIn: 'root'
})
export class AgentVisiteurService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<AgentVisiteurDtos[]> {
    return this.http.get<AgentVisiteurDtos[]>(`${environment.apiUrl}/api/AgentVisiteurs`);
  }

  getById(id: number): Observable<AgentVisiteurDtos> {
    return this.http.get<AgentVisiteurDtos>(`${environment.apiUrl}/api/AgentVisiteurs/${id}`);
  }

  create(agent: AgentVisiteurDtos): Observable<AgentVisiteurDtos> {
    return this.http.post<AgentVisiteurDtos>(`${environment.apiUrl}/api/AgentVisiteurs`, agent);
  }

  update(id: number, agent: AgentVisiteurDtos): Observable<AgentVisiteurDtos> {
    return this.http.put<AgentVisiteurDtos>(`${environment.apiUrl}/api/AgentVisiteurs/${id}`, agent);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/AgentVisiteurs/${id}`);
  }

  affecterAgent(agent: AffecterAgentDtos): Observable<AgentVisiteurDtos> {
    return this.http.post<AgentVisiteurDtos>(`${environment.apiUrl}/api/AgentVisiteurs/AffecterAgent`, agent);
  }

  getCentresForLookUp(): Observable<KeyValuesDtos[]> {
    return this.http.get<KeyValuesDtos[]>(`${environment.apiUrl}/api/AgentVisiteurs/GetCentreForLookUp`);
  }

  export(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/AgentVisiteurs/Export`, { responseType: 'blob' });
  }
  getAllAgentForCreation(): Observable<AgentForCreateDtos[]> {
    return this.http.get<AgentForCreateDtos[]>(`${environment.apiUrl}/api/AgentVisiteurs/GetAllAgentForCreation`);
  }

  updateSentToCneh(id: number, agent): Observable<any> {

    return this.http.put(`${environment.apiUrl}/api/AgentVisiteurs/UpdateSentStatus/${id}`,  agent );
  }

  uploadCapPdf(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/api/AgentVisiteurs/UploadCapPdf/${id}`, formData);
  }
  downloadCapPdf(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/AgentVisiteurs/DownloadFileCap/${id}`, {
      responseType: 'blob'
    });
  }
  deleteErroneAgent(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/AgentVisiteurs/ForCreation/${id}`, null);
  }
}