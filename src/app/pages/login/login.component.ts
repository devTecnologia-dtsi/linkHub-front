import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { CommonModule } from '@angular/common';
import { filter, Subject, Subscription } from 'rxjs';
import { MsalService, MsalModule, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoadingService } from '../../service/loading/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, CommonModule, RouterOutlet, MsalModule, NzModalModule, NzSpinModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private loadingSubscription: Subscription;
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  error = false;
  mensajeError: string = '';
  isLoading = false;
  isVisible = false;

  isConfirmLoading = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  constructor(
    private route: Router,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private loadingService: LoadingService
  ) {
    this.loadingSubscription = this.loadingService.isLoading$().subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      if (params['messageError']) {
        this.authService.logoutRedirect()
        this.mensajeError = params['messageError'].replace(/\\n/g, '\n');
        this.message.error(`<b>¡Ups!</b> ${this.mensajeError}`, { nzDuration: 2500 })
      }
    });

    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result) {
          //this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error al manejar la redirección', error);
      }
    });


    this.setLoginDisplay();
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = "/";
        } else {
          this.setLoginDisplay();
        }
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    if (this.loginDisplay) {
      //this.router.navigate(['/dashboard']);
    }
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  login() {
    // this.route.navigate(['/dashboard']);
    this.authService.loginPopup().subscribe({
      next: (result) => {
        this.route.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
