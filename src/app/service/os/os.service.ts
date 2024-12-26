import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatatableOs, ResponseOs } from '../../interface/os.interface';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OsService {

  constructor(private http: HttpClient) { }

  saveOs(nombre: string | undefined, version: string | undefined) {
    return this.http.post<ResponseOs>(`${environment.baseUrl}/sistema-operativo`, { nombre, version })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllOs() {
    return this.http.get(`${environment.baseUrl}/sistema-operativo`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editOs(data: DatatableOs) {
    return this.http.put(`${environment.baseUrl}/sistema-operativo?`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/sistema-operativo?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllOsActivos() {
    return this.http.get(`${environment.baseUrl}/sistema-operativo?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
