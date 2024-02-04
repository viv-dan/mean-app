import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class authService {
  token: string;
  private userId: string;
  private timer: any;
  private authStatusListener = new Subject<boolean>();
  private authStatus = false;
  constructor(private http: HttpClient, private router: Router) {}
  createUser(email: string, password: string) {
    const user: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', user)
      .subscribe((response) => {
        console.log(response);
      });
  }

  getAuthStatus() {
    return this.authStatus;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string) {
    const user: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        user
      )
      .subscribe((response) => {
        this.token = response.token;
        this.userId = response.userId;
        if (this.token) {
          this.timer = setTimeout(() => {
            this.logout();
          }, response.expiresIn * 1000);
          this.authStatus = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + response.expiresIn * 1000
          );
          this.saveAuthData(response.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    if (authData.expiration > now) {
      this.token = authData.token;
      this.authStatus = true;
      this.authStatusListener.next(true);
      this.userId = authData.userId;
      this.timer = setTimeout(() => {
        this.logout();
      }, authData.expiration.getTime() - now.getTime());
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expiration) {
      return;
    }
    return { token: token, expiration: new Date(expiration), userId: userId };
  }

  logout() {
    this.token = null;
    this.authStatus = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    this.userId = null;
    clearTimeout(this.timer);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
