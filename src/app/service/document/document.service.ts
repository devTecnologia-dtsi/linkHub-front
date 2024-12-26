import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatatableDocument, ResponseDocument } from '../../interface/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  saveDocument(descripcion: string | undefined) {
    return this.http.post<ResponseDocument>(`${environment.baseUrl}/documento`, { nombre_documento: descripcion })
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getAllDocuments() {
    return this.http.get(`${environment.baseUrl}/documento`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  getDocumentActives(){
    return this.http.get(`${environment.baseUrl}/documento?activo`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  editDocument(data: DatatableDocument) {
    return this.http.put(`${environment.baseUrl}/documento`, data)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }

  changeState(id: string) {
    return this.http.put(`${environment.baseUrl}/documento?id=${id}&func=changeState`,{})
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
