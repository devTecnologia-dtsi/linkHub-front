import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { InfoUser } from '../../interface/digibee.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DigibeeService {
  constructor(private http: HttpClient) {}

  getInfoUser(mail: string): Observable<InfoUser> {
    return this.http.get<InfoUser>(
      `${environment.baseUrl}/digibee/consultar-cuenta?email=${mail}`
    );
  }
}
