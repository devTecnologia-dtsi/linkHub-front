import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { DatatableEnviroment, ResponseEnviroment } from '../../interface/enviroment.interface';

@Injectable({
  providedIn: 'root'
})
export class EnviromentService {

  constructor(private http: HttpClient) { }

  saveEnviroment(descripcion: string | undefined) {
    return this.http.post<ResponseEnviroment>(`${environment.baseUrl}/ambiente`, { descripcion })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAnEnviroment(descripcion: string){
    return this.http.get(`${environment.baseUrl}/ambiente`)
  }

  getAllEnviroments() {
    return this.http.get(`${environment.baseUrl}/ambiente`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editEnviroment(data: DatatableEnviroment) {
    return this.http.put(`${environment.baseUrl}/ambiente`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/ambiente?id=${id}&func=changeState`,{})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllEnviromentsActivos() {
    return this.http.get(`${environment.baseUrl}/ambiente?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
