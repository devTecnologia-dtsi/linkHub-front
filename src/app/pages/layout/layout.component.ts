import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { AccesoUsuarioService } from '../../service/auth/acceso-service';
import { PhotographyService } from '../../service/photography/photography.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterOutlet,
    NzAvatarModule,
    NzBadgeModule,
    NzDropDownModule,
    NzCardModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  isCollapsed: boolean = false;
  loginDisplay: boolean = false;
  nombreUsuario: string = '';
  cargoUsuario: string = '';
  tipoUsuario: string = '';
  correo: string = '';
  photographyUser: string = '';

  constructor(
    private authService: MsalService,
    private accesouser: AccesoUsuarioService,
    private photographyService: PhotographyService
  ) {}

  ngOnInit(): void {
    const du = this.accesouser.decodeDataUser();
    this.nombreUsuario = du.user.data.nombre;
    this.cargoUsuario = du.user.data.cargo;
    this.tipoUsuario = du.user.data.id_tipo_usuario;
    this.correo = du.user.data.correo;
    this.getPhotography();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  getPhotography() {
    this.photographyService.getPhotography(this.correo).subscribe({
      next: ({ response, message }) => {
        const photography = localStorage.getItem('photography');
        if (photography) {
          this.photographyUser = photography;
        }
      },
      error: (error) => {
        console.log('error');
        console.log(error);
      },
    });
  }

  logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
    localStorage.clear();
  }
}
