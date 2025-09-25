import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormDB, ResponseDB } from '../../interface/db.interface';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor(private http: HttpClient) {}

  saveDB(data: FormGroup<FormDB>, id: string) {
    return this.http
      .post<ResponseDB>(`${environment.baseUrl}/db`, { ...data.value, id })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })));
  }

  getAllDB() {
    return this.http
      .get(`${environment.baseUrl}/db`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })));
  }

  editDB(data: FormGroup<FormDB>, id: string) {
    return this.http
      .put(`${environment.baseUrl}/db`, { ...data.value, id })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })));
  }

  changeState(id: string) {
    return this.http
      .put(`${environment.baseUrl}/db?id=${id}&func=changeState`, {})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })));
  }

  getAllDBActives() {
    return this.http
      .get(`${environment.baseUrl}/db/activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })));
  }
}
