import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AccesoUsuarioService } from './acceso-service';
import { Observable, firstValueFrom } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard {
  public rolUsuario$: Observable<boolean> = new Observable<boolean>();

  constructor(
    private msalService: MsalService,
    private router: Router,
    private aus: AccesoUsuarioService,
    private loadingService: LoadingService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    // return true;
    if (this.msalService.instance.getAllAccounts().length > 0) {
      let correo = this.msalService.instance.getAllAccounts()[0].username;
      //correo = "lsedanog@uniminuto.edu.co";

      const token = localStorage.getItem('token');

      if (token) {
       // const decodedToken = jwtDecode<{ data: any }>(token!);
        return true;
      }
      else {
        try {
            this.loadingService.show();
            const admins = await firstValueFrom(this.aus.accesoUsuario(correo));

            if (!admins.resp) {
              this.loadingService.hide();
              this.router.navigate(['/login'], { queryParams: { messageError: admins.message } });
              return false;
            }
            else {
              //const decodedToken = jwtDecode<{ data: any }>(admins.token!);
              localStorage.setItem('token', admins.data);
              this.loadingService.hide();
              return true;
            }
          } catch (error: any) {
            this.loadingService.hide();
            this.router.navigate(['/login'], { queryParams: { messageError: error } });
            return false;
          }
      }
    }
    else {
      return false;
    }
  }
}

