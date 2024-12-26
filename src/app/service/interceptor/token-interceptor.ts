import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private URLGestorGrados: string = environment.baseUrl;

    constructor(private router: Router,
    ) { }
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const protectedBaseUrl = this.URLGestorGrados;
        if (req.url.startsWith(protectedBaseUrl)) {
          const token = localStorage.getItem("token");
          const clonedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });

          return next.handle(clonedReq).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401) {
                localStorage.removeItem("token");
                this.router.navigate(['/login']);
              }
              return throwError(error);
            })
          );
        }
        return next.handle(req);
    }
}
