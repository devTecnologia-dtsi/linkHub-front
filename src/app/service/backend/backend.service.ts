import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { DataTableBackend, ResponseBackend } from '../../interface/backend.interface';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  saveBackend(data: DataTableBackend) {
    return this.http.post<ResponseBackend>(`${environment.baseUrl}/backend`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllBackends() {
    return this.http.get(`${environment.baseUrl}/backend`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getBackendsActives(){
    return this.http.get(`${environment.baseUrl}/backend?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editBackend(data: DataTableBackend, id: string) {
    return this.http.put(`${environment.baseUrl}/backend`, { ...data, id })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/backend?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

}
