import { ErrorHandlerService } from './../error-handler.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Doctor, Office, Response, User } from '../../models/models';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProfileService {
  private readonly SERVER_URL = environment.apiUrl;
  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    'Accept': 'application/json',
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getAuthHeader(): any  {
    const jwt = localStorage.getItem('Authorization');
    let headerReq = JSON.parse(JSON.stringify(this.headerDict));
    if (!!jwt) {
      headerReq = { ...headerReq, Authorization: jwt };
    }
    return headerReq;
  }
  getDoctorInfo(): Observable<Response<Doctor>> {
    const GET_DOCTOR_INFO_URL = this.SERVER_URL + '/doctor';
    return this.http
      .get<HttpResponse<Response<Doctor>>>(GET_DOCTOR_INFO_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.getAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('GET_DOCTOR_INFO'))
      );
  }

  getProfileImage(img): string {
    if (!!img) {
      return this.SERVER_URL + '/' + img;
    }
    return this.SERVER_URL + 'photos/user.png';
  }

  getOffice(id): Observable<Response<Office>> {
    const GET_OFFICE_INFO_URL = this.SERVER_URL + '/office/' + id;
    return this.http.get<HttpResponse<Response<Office>>>(GET_OFFICE_INFO_URL, {
      observe: 'response',
      headers: new HttpHeaders(this.getAuthHeader())
    })
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError('GET_OFFICE_INFO'))
    );
  }

  saveUser(user): Observable<Response<User>> {
    const UPDATE_USER_INFO_URL = this.SERVER_URL + '/user';
    return this.http.put<HttpResponse<Response<User>>>(UPDATE_USER_INFO_URL, user , {
      observe: 'response',
      headers: new HttpHeaders(this.getAuthHeader())
    })
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError('UPDATE_USER_INFO'))
    );
  }

  saveDoctor(data): Observable<Response<Doctor>> {
    const UPDATE_DOCTOR_INFO_URL = this.SERVER_URL + '/doctor';
    return this.http.put<HttpResponse<Response<Doctor>>>(UPDATE_DOCTOR_INFO_URL, data, {
      observe: 'response',
      headers: new HttpHeaders(this.getAuthHeader())
    })
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError('UPDATE_DOCTOR_INFO'))
    );
  }

  addOffice(data): Observable<Response<Office>> {
    const UPDATE_OFFICE_INFO_URL = this.SERVER_URL + '/office';
    return this.http.post<HttpResponse<Response<Office>>>(UPDATE_OFFICE_INFO_URL, data, {
      observe: 'response',
      headers: new HttpHeaders(this.getAuthHeader())
    })
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError('UPDATE_OFFICE_INFO'))
    );
  }

  updateOffice(data): Observable<Response<any>> {
    const UPDATE_OFFICE_INFO_URL = this.SERVER_URL + '/office';
    return this.http.put<HttpResponse<Response<any>>>(UPDATE_OFFICE_INFO_URL, data, {
      observe: 'response',
      headers: new HttpHeaders(this.getAuthHeader())
    })
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError('UPDATE_OFFICE_INFO'))
    );
  }

  removeOffice(): Observable<Response<any>> {
    const OFFICE_URL = this.SERVER_URL + '/office';
    return this.http.delete<HttpResponse<Response<any>>>(OFFICE_URL, {
      observe: 'response',
      headers: new HttpHeaders(this.getAuthHeader())
    })
    .pipe(
      first(),
      catchError(this.errorHandlerService.handleError('REMOVE_OFFICE_INFO'))
    );
  }
}
