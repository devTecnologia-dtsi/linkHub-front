import { Injectable } from '@angular/core';
import { DatatableServer, ResponseServer } from '../../interface/server.interface';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }


  saveServer(data: DatatableServer) {
    const dataServe = { ...data, docker: data.docker ? 1 : 0 }
    return this.http.post<ResponseServer>(`${environment.baseUrl}/servidor`, dataServe)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllServers() {
    return this.http.get(`${environment.baseUrl}/servidor`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editServer(data: DatatableServer) {
    return this.http.put(`${environment.baseUrl}/servidor`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/servidor?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllServersActivos() {
    return this.http.get(`${environment.baseUrl}/servidor?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
