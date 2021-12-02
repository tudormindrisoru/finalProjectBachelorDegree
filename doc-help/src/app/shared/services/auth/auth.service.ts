import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loggedIn: boolean;

  private readonly SERVER_URL = "http://localhost:4200/api";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) { }

  // public onLogin(data): void {
  //   console.log(data);
  //   if(data.email === 'test@test.com' && data.password ==='pass') {
  //     this.loggedIn = true;
  //     this.router.navigate(['/dashboard']);
  //   }
  // }

  public async createCode(phone) {
    try {
      const CREATE_CODE_URL = this.SERVER_URL + "/auth/login-with-phone-step1";
      let result = await this.http.post<any>(CREATE_CODE_URL, phone);
      return result;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  public async validateCode(code) {
    try {
      const VALIDATE_CODE_URL = this.SERVER_URL + "/auth/login-with-phone-step2";
      let result = await this.http.post<any>(VALIDATE_CODE_URL, code); 
      return result;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  public async authWithEmailAndPassword(user) {
    try {
      const LOGIN_URL = this.SERVER_URL + "/auth/login-with-password";
      let result = await this.http.post<any>(LOGIN_URL,user);
      return result;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  public async register(data) {
    try {
      const REGISTER_URL_1 = this.SERVER_URL + "/auth/register-step1";
      let result = await this.http.post<any>(REGISTER_URL_1, data);
      return result;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  public async validateRegistration(code) {
    try {
      const REGISTER_URL_2 = this.SERVER_URL + "/auth/register-step2";
      let result = await this.http.post<any>(REGISTER_URL_2, code);
      return result;
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  login(): void {
    this._loggedIn = true;
    this.router.navigate(['/dashboard']);
  }

  get isLoggedIn(): boolean {
    return this._loggedIn; 
  }

}
