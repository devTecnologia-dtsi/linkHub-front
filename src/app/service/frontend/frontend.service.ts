import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatatableFrontend, ResponseFrontend } from '../../interface/frontend.interface';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrontendService {

  constructor(private http: HttpClient) { }

  saveFrontend(data: DatatableFrontend, id: string) {
    return this.http.post<ResponseFrontend>(`${environment.baseUrl}/frontend`, { ...data, id })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllFrontends() {
    return this.http.get(`${environment.baseUrl}/frontend`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editFrontend(data: DatatableFrontend, id: string) {
    return this.http.put(`${environment.baseUrl}/frontend`, { ...data, id })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/frontend?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
