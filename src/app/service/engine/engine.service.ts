import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DatatableEngine, ResponseEngine } from '../../interface/engine.interface';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  constructor(private http: HttpClient) { }

  saveEngine(descripcion: string | undefined) {
    return this.http.post<ResponseEngine>(`${environment.baseUrl}/motor`, { descripcion })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllEngines() {
    return this.http.get(`${environment.baseUrl}/motor`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editEngines(data: DatatableEngine) {
    return this.http.put(`${environment.baseUrl}/motor`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/motor?id=${id}&func=changeState`,{})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllEnginesActivos() {
    return this.http.get(`${environment.baseUrl}/motor?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
