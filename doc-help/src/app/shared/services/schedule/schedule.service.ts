import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SnackbarHandlerService } from '../snackbar-handler.service';
import { Doctor, Response, Schedule } from '../../models/models';
import { catchError, first, tap } from 'rxjs/operators';

@Injectable()
export class ScheduleService {
  private readonly SERVER_URL = environment.apiUrl;
  private readonly SCHEDULE_INTERVALS_URL =
    this.SERVER_URL + '/doctors/schedule/intervals';

  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    Accept: 'application/json',
  };

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

  getMySchedule(): Observable<Response<Schedule[]>> {
    return this.http
      .get<HttpResponse<Response<Schedule[]>>>(this.SCHEDULE_INTERVALS_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('GET_DOCTOR_SCHEDULE')
        )
      );
  }

  getDoctorScheduleById(id: number): Observable<Response<Schedule>> {
    const DOCTOR_SCHEDULE_URL = this.SERVER_URL + `/doctors/schedule/${id}`;
    return this.http
      .get<HttpResponse<Response<Schedule[]>>>(DOCTOR_SCHEDULE_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('GET_DOCTOR_SCHEDULE')
        )
      );
  }

  createScheduleInterval(interval): Observable<Response<Schedule>> {
    delete interval.id;

    return this.http
      .post<HttpResponse<Response<Schedule>>>(
        this.SCHEDULE_INTERVALS_URL,
        interval,
        {
          observe: 'response',
          headers: new HttpHeaders(this.jsonAuthHeader()),
        }
      )
      .pipe(
        first(),
        tap((result) => {
          console.log('test', result);
          const r = {
            message: result.ok
              ? 'Schedule interval created successfully.'
              : undefined,
          } as Response<string>;
          console.log(r);
          if (r.message) {
            this.snackbarHandlerService.handleSuccess(r);
          }
        }),
        catchError(
          this.snackbarHandlerService.handleError('POST_DOCTOR_SCHEDULE')
        )
      );
  }

  updateScheduleInterval(interval): Observable<Response<Schedule>> {
    return this.http
      .put<HttpResponse<Response<Schedule>>>(
        this.SCHEDULE_INTERVALS_URL,
        interval,
        {
          observe: 'response',
          headers: new HttpHeaders(this.jsonAuthHeader()),
        }
      )
      .pipe(
        first(),
        tap((result) => {
          this.snackbarHandlerService.handleSuccess(result.body);
        }),
        catchError(
          this.snackbarHandlerService.handleError('UPDATE_DOCTOR_SCHEDULE')
        )
      );
  }

  deleteScheduleInterval(intervalId: number): Observable<Response<string>> {
    if (intervalId === -1) {
      return;
    }
    return this.http
      .delete<HttpResponse<Response<Schedule>>>(
        this.SCHEDULE_INTERVALS_URL + `/${intervalId}`,
        {
          observe: 'response',
          headers: new HttpHeaders(this.jsonAuthHeader()),
        }
      )
      .pipe(
        first(),
        tap((result) => this.snackbarHandlerService.handleSuccess(result.body)),
        catchError(
          this.snackbarHandlerService.handleError('DELETE_DOCTOR_SCHEDULE')
        )
      );
  }

  saveScheduleInterval(interval): Observable<Response<Schedule>> {
    if (interval.id === -1) {
      return this.createScheduleInterval(interval);
    }
    return this.updateScheduleInterval(interval);
  }

  hourToNumber = (time: Date) => {
    const hours = new Date(time).getHours();
    const minutes = new Date(time).getMinutes();
    return hours * 60 + minutes;
  };

  isEndTimeHigherThanStartTime(startTime: Date, endTime: Date): boolean {
    const start = this.hourToNumber(startTime);
    const end = this.hourToNumber(endTime);
    if (start < end) {
      return true;
    }
    return false;
  }

  isScheduleIntervalValid(intervalToSubmit, alreadySavedIntervals): boolean {
    if (
      !this.isEndTimeHigherThanStartTime(
        intervalToSubmit.start,
        intervalToSubmit.end
      )
    ) {
      this.snackbarHandlerService.handleInfo(
        'Interval start time is higher than end time.'
      );
      return false;
    }
    console.log('alreadySaved = ', alreadySavedIntervals);
    const intervalOverlappingIndex = alreadySavedIntervals.value.findIndex(
      (element) =>
        (element.id !== intervalToSubmit.id ||
          (intervalToSubmit.id === -1 && element.id !== -1)) &&
        ((this.hourToNumber(intervalToSubmit.start) <
          this.hourToNumber(element.start) &&
          this.hourToNumber(intervalToSubmit.end) >
            this.hourToNumber(element.start)) ||
          (this.hourToNumber(intervalToSubmit.start) >=
            this.hourToNumber(element.start) &&
            this.hourToNumber(intervalToSubmit.end) <=
              this.hourToNumber(element.end)) ||
          (this.hourToNumber(intervalToSubmit.start) >=
            this.hourToNumber(element.start) &&
            this.hourToNumber(intervalToSubmit.start) <
              this.hourToNumber(element.end) &&
            this.hourToNumber(intervalToSubmit.end) >
              this.hourToNumber(element.end)))
    );
    if (intervalOverlappingIndex !== -1) {
      console.log(intervalToSubmit, intervalOverlappingIndex);
      this.snackbarHandlerService.handleInfo(
        'Interval overlapping with other interval.'
      );
      return false;
    }
    console.log('asda');
    return true;
  }

  calculateWorkingHoursLabel(scheduleIntervals): string {
    let total = 0;
    if (scheduleIntervals.length > 0) {
      scheduleIntervals.forEach((interval) => {
        total += interval.end - interval.start;
      });
    }
    const hours = total > 0 ? Math.floor(total / 60) : 0;
    const minutes = total - hours * 60;
    console.log(
      scheduleIntervals,
      hours + 'h' + (minutes > 0 ? ' ' + minutes + 'm' : '')
    );
    return hours + 'h' + (minutes > 0 ? ' ' + minutes + 'm' : '');
  }
}
