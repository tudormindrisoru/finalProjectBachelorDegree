import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../error-handler.service';
import { Doctor, Response, Schedule } from '../../models/models';
import { catchError, first } from 'rxjs/operators';

@Injectable()
export class ScheduleService {
  private readonly SERVER_URL = environment.apiUrl;
  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    Accept: 'application/json',
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  jsonAuthHeader(): any {
    const jwt = localStorage.getItem('Authorization');
    let headerReq = JSON.parse(JSON.stringify(this.headerDict));
    if (!!jwt) {
      headerReq = { ...headerReq, Authorization: jwt };
    }
    return headerReq;
  }

  getMySchedule(): Observable<Response<Doctor>> {
    const GET_MY_SCHEDULE_URL = this.SERVER_URL + '/doctors/schedule/intervals';
    return this.http
      .get<HttpResponse<Response<Schedule[]>>>(GET_MY_SCHEDULE_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('GET_DOCTOR_INFO'))
      );
  }
}
