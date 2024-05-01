import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';
import { Endpoints } from '../../constants/Endpoint';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  token: string | null = this.authService.getToken();
  constructor(private http: HttpClient, private authService: AuthService) { }

  getApi(endPoint: string, attributes: any) {
    return this.http.get(`http://localhost:3000/${endPoint}`, attributes);
  }

  postApi(endPoint: string, attributes: any) {
    return this.http.post(`http://localhost:3000/${endPoint}`, attributes);
  }

  getSelectValues(endPoint: string) {
    return this.http.get(endPoint);
  }

  addApplication(parameters: any) {
    const body = {
      "Application": parameters,
      "Token": this.token,
    }
    return this.http.post(Endpoints.applications, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}