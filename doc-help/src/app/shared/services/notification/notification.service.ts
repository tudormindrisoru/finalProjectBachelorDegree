import { SnackbarHandlerService } from './../snackbar-handler.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, first } from 'rxjs/operators';
import { Appointment, Response } from 'src/app/shared/models/models';
import { environment } from 'src/environments/environment';
import { SseService } from '../sse/sse.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
  private _isShown: boolean = false;

  private _appointmentNotifications: Appointment[];
  private readonly SERVER_URL = environment.apiUrl;
  private readonly PENDING_APPOINTMENTS_URL =
    this.SERVER_URL + '/appointments/pending';
  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    Accept: 'application/json',
  };

  public appointmentNotifications$: BehaviorSubject<Appointment[]> =
    new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    private snackbarHandlerService: SnackbarHandlerService,
    private sseService: SseService,
    private _zone: NgZone
  ) {}

  jsonAuthHeader(): any {
    const jwt = localStorage.getItem('Authorization');
    let headerReq = JSON.parse(JSON.stringify(this.headerDict));
    if (!!jwt) {
      headerReq = { ...headerReq, Authorization: jwt };
    }
    return headerReq;
  }

  getPendingAppointments(): Observable<Response<Appointment[]>> {
    return this.http
      .get<HttpResponse<Response<Appointment[]>>>(
        this.PENDING_APPOINTMENTS_URL,
        {
          observe: 'response',
          headers: new HttpHeaders(this.jsonAuthHeader()),
        }
      )
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('GET_PENDING_APPOINTMENTS')
        )
      );
  }

  getPendingAppointmentById(id: number): Observable<Response<Notification>> {
    return this.http
      .get<HttpResponse<Response<Notification[]>>>(
        this.PENDING_APPOINTMENTS_URL + `/${id}`,
        {
          observe: 'response',
          headers: new HttpHeaders(this.jsonAuthHeader()),
        }
      )
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError(
            'GET_PENDING APPOINTMENT_BY_ID'
          )
        )
      );
  }

  get isShown(): boolean {
    return this._isShown || false;
  }

  get appointments(): Appointment[] {
    return this._appointmentNotifications || undefined;
  }

  set appointments(value: Appointment[]) {
    this._appointmentNotifications = value;
  }

  onToggleNotifications(): void {
    this._isShown = !this._isShown;
  }

  getEventSentEvent(): Observable<any> {
    return new Observable((observer) => {
      const eventSource = this.sseService.getEventSource(
        this.SERVER_URL + '/sse'
      );

      eventSource.onmessage = (event) => {
        this._zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = (error) => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }
}
