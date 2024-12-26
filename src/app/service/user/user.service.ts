import { Injectable } from '@angular/core';
import { DatatableUser, ResponseUser } from '../../interface/user.interface';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  saveUser(data: DatatableUser) {
    const dataServe = { ...data }

    return this.http.post<ResponseUser>(`${environment.baseUrl}/usuario`, dataServe)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllUser() {
    return this.http.get(`${environment.baseUrl}/usuario`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getUsersActives() {
    return this.http.get(`${environment.baseUrl}/usuario?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editUser(data: DatatableUser) {
    return this.http.put(`${environment.baseUrl}/usuario`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/usuario?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
