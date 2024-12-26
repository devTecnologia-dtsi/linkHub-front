import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AccesoUsuarioService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient,
  ) {}

  accesoUsuario(correo: any): Observable<any> {
    const body = {
      "correo": correo,
    };
    return this.http.post<any>(`${environment.baseUrl}/acceso-usuario`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(
        `Código de error ${error.status}, ` +
        `mensaje: ${error.error}`);
    }
    return throwError('Ocurrio  un error de conexión; por favor, inténtalo de nuevo más tarde.');
  }

  decodeDataUser(): any{
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<{ dataT: any }>(token!);
      return decodedToken;
    }
    else {
      return;
    }
  }

}


