import { DashboardModule } from 'src/app/pages/dashboard/dashboard.module';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Observable } from 'rxjs/internal/Observable';
import { Doctor, Response, Appointment } from '../../models/models';
import { environment } from 'src/environments/environment';
import { catchError, first } from 'rxjs/operators';

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
    const GET_APPROVED_APPOINTMENTS_URL = this.SERVER_URL + '/appointments/approved';
    const params = new HttpParams()
    .set('startDate', data.startDate)
    .set('endDate', data.endDate);
    return this.http
      .get<HttpResponse<Response<Appointment[]>>>(GET_APPROVED_APPOINTMENTS_URL, {
        observe: 'response',
        params: params,
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError('GET_APPROVED_APPOINTMENTS'))
      );
  }

}
