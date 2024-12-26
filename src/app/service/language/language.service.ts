import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { DataTableLanguage, ResponseLanguage } from '../../interface/language.interface';

@Injectable({
  providedIn: 'root'
})
export class languageService {

  constructor(private http: HttpClient) { }

  saveLanguage(data: DataTableLanguage){
    return this.http.post<ResponseLanguage>(`${environment.baseUrl}/lenguaje`,data)
    .pipe(catchError((error) => of({ok: false, error, result:[]})));

  }

  getAllLanguage() {
    return this.http.get(`${environment.baseUrl}/lenguaje`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getLanguageActive() {
    return this.http.get(`${environment.baseUrl}/lenguaje?activos`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editLanguage(data: DataTableLanguage){
    return this.http.put(`${environment.baseUrl}/lenguaje`,data)
    .pipe(catchError((error) => of({ ok: false, error, result:[] })))
  }

  changeState(id:string){
    return this.http.put(`${environment.baseUrl}/lenguaje?id=${id}&func=changeState`,{})
    .pipe(catchError((error) => of({ok: false, error, result:[] })))
  }
}
