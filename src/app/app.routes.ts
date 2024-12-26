import { Routes } from '@angular/router';
import { AuthGuard } from './service/auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { RoleProjectComponent } from './pages/configuration/role-project/role-project.component';
import { DocumentComponent } from './pages/panel/document/document.component';
import { UserTypeComponent } from './pages/configuration/user-type/user-type.component';
import { UserComponent } from './pages/configuration/user/user.component';
import { EngineComponent } from './pages/panel/engine/engine.component';
import { DbComponent } from './pages/panel/db/db.component';
import { languageComponent } from './pages/panel/language/language.component';
import { EnviromentComponent } from './pages/panel/enviroment/enviroment.component';
import { OsComponent } from './pages/panel/os/os.component';
import { BackendComponent } from './pages/integration/backend/backend.component';
import { FrontendComponent } from './pages/integration/frontend/frontend.component';
import { ServerComponent } from './pages/panel/server/server.component';
import { AppComponent } from './app.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      }
    ]
  },
  {
    path: 'configuration',
    component: LayoutComponent,
    children: [
      {
        path: 'project/role',
        component: RoleProjectComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [MsalGuard, AuthGuard]
      },
      {
        path: 'type/user',
        component: UserTypeComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      }
    ]
  },
  {
    path: 'panel',
    component: LayoutComponent,
    children: [
      {
        path: 'enviroment',
        component: EnviromentComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'DB',
        component: DbComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'document',
        component: DocumentComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'language',
        component: languageComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'engine',
        component: EngineComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'OS',
        component: OsComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'server',
        component: ServerComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      }
    ]
  },
  {
    path: 'integration',
    component: LayoutComponent,
    children: [
      {
        path: 'backend',
        component: BackendComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      },
      {
        path: 'frontend',
        component: FrontendComponent,
        canActivate: [
          MsalGuard,
          AuthGuard
        ]
      }
    ]
  }
];
