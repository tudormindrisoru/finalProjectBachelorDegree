import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Response, Appointment } from 'src/app/shared/models/models';
import { SnackbarHandlerService } from 'src/app/shared/services/snackbar-handler.service';
import { environment } from 'src/environments/environment';

export interface Patient {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  reports?: number;
}

export interface AppointmentHistory {
  id: string;
  patient: Patient;
  date: Date;
  startHour: string;
  endHour: string;
  reported?: boolean;
  comment?: string;
}

@Injectable()
export class PatientsService {
  _appointmentsHistory: AppointmentHistory[] = [
    {
      id: '312512412saas',
      patient: {
        firstName: 'Nume1',
        lastName: 'Prenume1',
        phoneNumber: '0742123123',
        reports: 1,
      },
      date: new Date('2021-05-21'),
      startHour: '10:30',
      endHour: '11:00',
      reported: true,
    },
    {
      id: 'zcxdas1231das',
      patient: {
        firstName: 'Nume2',
        lastName: 'Prenume2',
        phoneNumber: '0742321321',
        reports: 0,
      },
      date: new Date('2021-05-21'),
      startHour: '11:30',
      endHour: '12:00',
      reported: false,
    },
    {
      id: '3123asdas1231',
      patient: {
        firstName: 'Nume3',
        lastName: 'Prenume3',
        phoneNumber: '0740992992',
        reports: 3,
      },
      date: new Date('2021-05-22'),
      startHour: '08:30',
      endHour: '12:00',
      reported: true,
    },
    {
      id: 'dasdq1e212dsa',
      patient: {
        firstName: 'Nume4',
        lastName: 'Prenume4',
        phoneNumber: '0740993162',
        reports: 2,
      },
      date: new Date('2021-05-22'),
      startHour: '13:30',
      endHour: '14:00',
      reported: false,
    },
  ];

  private readonly SERVER_URL = environment.apiUrl;
  private headerDict = {
    'Content-Type': 'application/json',
    // tslint:disable-next-line: object-literal-key-quotes
    Accept: 'application/json',
  };
  public readonly PATIENT_HISTORY_URL =
    this.SERVER_URL + '/doctors/patient-history';
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

  get appointmentsHistory(): AppointmentHistory[] {
    return this._appointmentsHistory || undefined;
  }
  set appointmentsHistory(appointments: AppointmentHistory[]) {
    this._appointmentsHistory = appointments;
  }

  getHistory(): Observable<Response<Appointment[]>> {
    return this.http
      .get<HttpResponse<Response<Appointment[]>>>(this.PATIENT_HISTORY_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('GET_DOCTORS_PATIENT_HISTORY')
        )
      );
  }
}
