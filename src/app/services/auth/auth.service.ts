import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(@Inject(DOCUMENT) private document: Document) { }
  localStorage = this.document.defaultView?.localStorage;
  token: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getToken() {
    return this.localStorage?.getItem('token') || null;
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.token.next(token);
  }
}