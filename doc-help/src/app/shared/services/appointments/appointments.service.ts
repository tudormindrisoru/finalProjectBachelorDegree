import { User } from 'src/app/shared/models/models';
import { DashboardModule } from 'src/app/pages/dashboard/dashboard.module';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Observable } from 'rxjs/internal/Observable';
import { Response, Appointment } from 'src/app/shared/models/models';
import { environment } from 'src/environments/environment';
import { catchError, debounce, first } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable()
export class AppointmentsService {

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

  private readonly SERVER_URL = environment.apiUrl;

  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    'Accept': 'application/json',
  };

  jsonAuthHeader(): any  {
    const jwt = localStorage.getItem('Authorization');
    let headerReq = JSON.parse(JSON.stringify(this.headerDict));
    if (!!jwt) {
      headerReq = { ...headerReq, Authorization: jwt };
    }
    return headerReq;
  }

  getApprovedAppointments(data: any): Observable<Response<Appointment[]>> {
    const APPROVED_APPOINTMENTS_URL = this.SERVER_URL + '/appointments/approved';
    const params = new HttpParams()
    .set('startDate', data.startDate)
    .set('endDate', data.endDate);
    return this.http
      .get<HttpResponse<Response<Appointment[]>>>(APPROVED_APPOINTMENTS_URL, {
        observe: 'response',
        params: params,
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('GET_APPROVED_APPOINTMENTS'))
      );
  }

  createApprovedAppointment(data: any): Observable<Response<any>> {
    const APPROVED_APPOINTMENTS_URL = this.SERVER_URL + `/appointments/approved`;
    return this.http
      .post<HttpResponse<Response<Appointment>>>(APPROVED_APPOINTMENTS_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('CREATE_APPROVED_APPOINTMENT'))
      );
  }

  updateApprovedAppointment(data: any): Observable<Response<any>> {
    const APPROVED_APPOINTMENTS_URL = this.SERVER_URL + `/appointments/approved`;
    return this.http
      .put<HttpResponse<Response<Appointment>>>(APPROVED_APPOINTMENTS_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('UPDATE_APPROVED_APPOINTMENT'))
      );
  }

  deleteApprovedAppointments(id: number): Observable<Response<any>> {
    const APPROVED_APPOINTMENTS_URL = this.SERVER_URL + `/appointments/approved/${id}`;
    return this.http
      .get<HttpResponse<Response<any>>>(APPROVED_APPOINTMENTS_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('DELETE_APPROVED_APPOINTMENT'))
      );
  }

  getUsersByName(name): Observable<Response<User[]>> {
    const USER_URL = this.SERVER_URL + `/users`;
    const params = new HttpParams()
    .set('name', name);
    return this.http
      .get<HttpResponse<Response<User[]>>>(USER_URL, {
        observe: 'response',
        params: params,
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        debounce(() => timer(2000)),
        catchError(this.errorHandlerService.handleError('GET_USERS_BY_NAME'))
      );
  }

}