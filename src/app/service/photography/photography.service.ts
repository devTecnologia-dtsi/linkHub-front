import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { catchError, Observable, of } from 'rxjs';
import { DigibeeService } from '../digibee/digibee.service';
import { AuthenticationResult } from '@azure/msal-browser';
import { PhothographyResponse } from '../../interface/phothography.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhotographyService {
  constructor(
    private http: HttpClient,
    private authService: MsalService,
    private digibee: DigibeeService
  ) {}

  getPhotography(mail: string) {
    return new Observable<PhothographyResponse>((observer) => {
      const documento = localStorage.getItem('documento');
      if (!documento) {
        this.digibee.getInfoUser(mail).subscribe({
          next: ({ pager }) => {
            if (!pager) {
              throw new Error('No se puede obtener el documento del usuario');
            }
            localStorage.setItem('documeto', pager);
            this.getTokenMsal().subscribe({
              next: (responseMsal) => {
                if (!responseMsal?.accessToken) {
                  throw new Error(
                    'Hubo un error al obtener el token del usuario'
                  );
                }
                this.getBlobPhotography(
                  pager,
                  responseMsal.accessToken
                ).subscribe({
                  next: (responseBlobPhotography) => {
                    const urlPhotography = URL.createObjectURL(
                      responseBlobPhotography
                    );
                    localStorage.setItem('photography', urlPhotography);
                    observer.next({
                      response: true,
                      message: 'Foto cargada con exito',
                    });
                  },
                  error: (error) => {
                    console.log(error);
                    observer.error(
                      'Hubo un error al consultar la foto del usuario'
                    );
                  },
                });
              },
              error: () => {
                observer.error({
                  response: false,
                  message: 'Error al consultar el token del usuario',
                });
              },
            });
          },
          error: (error) => {
            console.log(error);
            observer.error({
              response: false,
              message: 'Error al consultar la información del usuario',
            });
          },
        });
      } else {
        this.getTokenMsal().subscribe({
          next: (responseMsal) => {
            if (!responseMsal?.accessToken) {
              throw new Error('Hubo un error al obtener el token del usuario');
            }
            this.getBlobPhotography(
              documento,
              responseMsal.accessToken
            ).subscribe({
              next: (responseBlobPhotography) => {
                const urlPhotography = URL.createObjectURL(
                  responseBlobPhotography
                );
                localStorage.setItem('photography', urlPhotography);
                observer.next({
                  response: true,
                  message: 'Foto cargada con exito',
                });
              },
              error: (error) => {
                console.log(error);
                observer.error(
                  'Hubo un error al consultar la foto del usuario'
                );
              },
            });
          },
          error: () => {
            observer.error({
              response: false,
              message: 'Error al consultar el token del usuario',
            });
          },
        });
      }
    });
  }

  private getTokenMsal(): Observable<AuthenticationResult | null> {
    const profile_data = this.authService.instance.getAllAccounts()[0];
    return this.authService
      .acquireTokenSilent({
        scopes: ['user.read'],
        account: profile_data,
      })
      .pipe(
        catchError((error) => {
          console.error('Error acquiring token:', error);
          this.authService.loginRedirect({
            scopes: ['user.read'],
          });
          return of(null);
        })
      );
  }

  private getBlobPhotography(dni: string, token: string): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.URLApiFotografia}/images/${dni}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob' as 'json',
      }
    );
  }
}
