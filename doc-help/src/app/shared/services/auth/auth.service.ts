import { Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarHandlerService } from '../snackbar-handler.service';
import { User, Response } from '../../models/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private headerDict = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  private readonly SERVER_URL = environment.apiUrl;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private snackbarHandlerService: SnackbarHandlerService
  ) {}

  jsonAuthHeader(): any {
    const jwt = localStorage.getItem('Authorization');
    let headerReq = JSON.parse(JSON.stringify(this.headerDict));
    if (!!jwt) {
      headerReq = { ...headerReq, Authorization: jwt };
    }
    return headerReq;
  }

  public smsSingInFirstStep(data: any): Observable<any> {
    const CREATE_CODE_URL = this.SERVER_URL + '/auth/login-with-phone-step1';
    return this.http
      .post<any>(CREATE_CODE_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.headerDict),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('SMS_SIGN_IN_FIRST_STEP')
        )
      );
  }

  public smsSingInSecondStep(data: any): Observable<any> {
    const VALIDATE_CODE_URL = this.SERVER_URL + '/auth/login-with-phone-step2';
    return this.http
      .post<any>(VALIDATE_CODE_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.headerDict),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('SMS_SIGN_IN_SECOND_STEP')
        )
      );
  }

  public authWithEmailAndPassword(user): Observable<Response<User>> {
    const LOGIN_URL = this.SERVER_URL + '/auth/login-with-password';
    return this.http
      .post(LOGIN_URL, user, {
        observe: 'response',
        headers: new HttpHeaders(this.headerDict),
      })
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('NORMAL_SIGN_IN'))
      );
  }

  public register(data): Observable<any> {
    const REGISTER_URL_1 = this.SERVER_URL + '/auth/register-step1';
    return this.http
      .post<any>(REGISTER_URL_1, data, {
        observe: 'response',
        headers: new HttpHeaders(this.headerDict),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('REGISTER_FIRST_STEP')
        )
      );
  }

  public validateRegistration(code): Observable<any> {
    const REGISTER_URL_2 = this.SERVER_URL + '/auth/register-step2';
    return this.http
      .post<any>(REGISTER_URL_2, code, {
        observe: 'response',
        headers: new HttpHeaders(this.headerDict),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('REGISTER_SECOND_STEP')
        )
      );
  }

  public getUser(): Observable<Response<User>> {
    return this.http
      .get<HttpResponse<Response<User>>>(
        this.SERVER_URL + '/auth/user-by-token',
        {
          observe: 'response',
          headers: new HttpHeaders(this.jsonAuthHeader()),
        }
      )
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('GET_USER_INFO'))
      );
  }
}
