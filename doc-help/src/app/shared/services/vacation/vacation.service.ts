import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';

import { SnackbarHandlerService } from '../snackbar-handler.service';
import { Doctor, Response, Schedule, Vacation } from '../../models/models';
import { Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
  private readonly SERVER_URL = environment.apiUrl;
  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    Accept: 'application/json',
  };
  public VACATION_URL = this.SERVER_URL + '/doctors/vacation';
  constructor(
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

  getMyVacations(): Observable<Response<Vacation[]>> {
    return this.http
      .get<HttpResponse<Response<Vacation[]>>>(this.VACATION_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('GET_DOCTOR_VACATION')
        )
      );
  }

  getDoctorVacationByDoctorId(id: number): Observable<Response<Vacation[]>> {
    return this.http
      .get<HttpResponse<Response<Vacation[]>>>(this.VACATION_URL + `/${id}`, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('GET_DOCTOR_VACATION')
        )
      );
  }

  saveVacation(vacation: Vacation): Observable<Response<any>> {
    if (vacation.id < 0) {
      return this.createVacation(vacation);
    }
    return this.updateVacation(vacation);
  }

  createVacation(vacation: Vacation): Observable<Response<string>> {
    return this.http
      .post<HttpResponse<Response<Vacation>>>(this.VACATION_URL, vacation, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        tap((result) => {
          const r = {
            message: result.ok ? 'Vacation created successfully.' : undefined,
          } as Response<string>;
          if (r.message) {
            this.snackbarHandlerService.handleSuccess(r);
          }
        }),
        catchError(
          this.snackbarHandlerService.handleError('CREATE_DOCTOR_VACATION')
        )
      );
  }

  updateVacation(vacation: Vacation): Observable<Response<Vacation>> {
    return this.http
      .put<HttpResponse<Response<Vacation>>>(this.VACATION_URL, vacation, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        tap((result) => {
          this.snackbarHandlerService.handleSuccess(result.body);
        }),
        catchError(
          this.snackbarHandlerService.handleError('UPDATE_DOCTOR_VACATION')
        )
      );
  }

  removeVacation(id: number): Observable<Response<string>> {
    if (id < 0) {
      return;
    }
    return this.http
      .delete<HttpResponse<Response<string>>>(this.VACATION_URL + `/${id}`, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        tap((result) => {
          this.snackbarHandlerService.handleSuccess(result.body);
        }),
        catchError(
          this.snackbarHandlerService.handleError('UPDATE_DOCTOR_VACATION')
        )
      );
  }
}
