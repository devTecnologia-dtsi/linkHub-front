import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';
import { DataTableUserType, ResponseUserType } from '../../interface/user-type.interface';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  constructor(private http: HttpClient) { }

  saveUserType(data: DataTableUserType){
    return this.http.post<ResponseUserType>(`${environment.baseUrl}/tipo-usuario`,data)
    .pipe(catchError((error) => of({ok: false, error, result:[]})));

  }

  getAllUsertype() {
    return this.http.get(`${environment.baseUrl}/tipo-usuario`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editUserType(data: DataTableUserType){
    return this.http.put(`${environment.baseUrl}/tipo-usuario`,data)
    .pipe(catchError((error) => of({ ok: false, error, result:[] })))
  }

  changeState(id:string){
    return this.http.put(`${environment.baseUrl}/tipo-usuario?id=${id}&func=changeState`,{})
    .pipe(catchError((error) => of({ok: false, error, result:[] })))
  }
}
