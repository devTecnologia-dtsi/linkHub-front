import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getLanguageByProjects() {
    return this.http.get(`${environment.baseUrl}/dashboard`)
      .pipe(catchError((error) => of({ ok: false, error, result: [] })))
  }
}
