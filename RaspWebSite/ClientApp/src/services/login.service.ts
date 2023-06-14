import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import jwt_decode, { JwtPayload } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) { }

  public logout(): void {
    localStorage.removeItem("access_token");
  }

  public getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  public async login(userName: string, password: string): Promise<boolean> {
    return await lastValueFrom(this.http.post<TokenDTO>(this.apiUrl + 'users/login',
      {
        userName,
        password
      })
      .pipe(
        map(tokenDTO => {
          localStorage.setItem("access_token", tokenDTO.token);
          return true;
        }),
        catchError(err => {
          console.error(err);
          return of(false);
        })
      ));
  }

  public async check(): Promise<boolean> {
    return await lastValueFrom(this.http.get(this.apiUrl + 'users/ping')
      .pipe(
        map(_ => true), // If OK (200), we return true.
        catchError(err => {
          console.error(err);
          return of(false);
        }) // If not OK (like 401) - false.
      ));
  }

  public getName(): string {
    var token = this.getToken();
    if (token != null) {
      return jwt_decode<Token>(token).name;
    } else {
      return "UNKNOWN";
    }
  }
}

interface TokenDTO {
  token: string;
}

interface Token extends JwtPayload {
  name: string;
  nameId: string;
}
