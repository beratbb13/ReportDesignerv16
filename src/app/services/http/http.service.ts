import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getApi(endPoint: string, attributes: any) {
    return this.http.get(`http://localhost:3000/${endPoint}`, attributes);
  }

  postApi(endPoint: string, attributes: any) {
    return this.http.post(`http://localhost:3000/${endPoint}`, attributes);
  }
}
