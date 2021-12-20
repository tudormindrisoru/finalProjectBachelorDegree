import { ErrorHandlerService } from './../error-handler.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Doctor, Response } from '../../models/models';

@Injectable()
export class ProfileService {
  private readonly SERVER_URL = 'http://localhost:3000/api';
  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    'Accept': 'application/json',
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getDoctorInfo(): Observable<Response<Doctor>> {
    const GET_DOCTOR_INFO_URL = this.SERVER_URL + '/doctor';
    const jwt = localStorage.getItem('Authorization');
    let headersReq = JSON.parse(JSON.stringify(this.headerDict));
    if (!!jwt) {
      // tslint:disable-next-line: object-literal-key-quotes
      headersReq = { ...headersReq, Authorization: jwt };
    }
    return this.http
      .get<HttpResponse<Response<Doctor>>>(GET_DOCTOR_INFO_URL, {
        observe: 'response',
        headers: new HttpHeaders(headersReq),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('GET_DOCTOR_INFO'))
      );
  }
}
