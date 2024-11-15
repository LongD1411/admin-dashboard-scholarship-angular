import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroment/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthResponse } from '../response/auth.response';
import { BaseResponse } from '../response/base.reponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private apiLogin = `${enviroment.apiBaseUrl}/auth/login`;
  private apiLogout = `${enviroment.apiBaseUrl}/auth/logout`;
  constructor(private http: HttpClient) {}
  login(loginDTO: any): Observable<BaseResponse<AuthResponse>> {
    return this.http.post<BaseResponse<AuthResponse>>(this.apiLogin, loginDTO);
  }
  logout(): Observable<any> {
    const token = this.getToken();
    const data = {
      token: token,
    };
    return this.http.post<any>(this.apiLogout, data);
  }
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
