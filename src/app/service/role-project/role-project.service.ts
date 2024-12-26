import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatatableRoleProject, ResponseRoleProject } from '../../interface/roleproject.interface';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RoleProjectService {

  constructor(private http: HttpClient) { }

  saveRoleProject(descripcion: string | undefined) {
    return this.http.post<ResponseRoleProject>(`${environment.baseUrl}/roles-proyecto`, { descripcion })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllRoleProjects() {
    return this.http.get(`${environment.baseUrl}/roles-proyecto`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editRoleProject(data: DatatableRoleProject) {
    return this.http.put(`${environment.baseUrl}/roles-proyecto`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/roles-proyecto?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
