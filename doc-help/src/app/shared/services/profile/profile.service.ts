import { SnackbarHandlerService } from '../snackbar-handler.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { catchError, debounce, first } from 'rxjs/operators';
import { Doctor, Office, Response, User } from '../../models/models';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProfileService {
  private readonly SERVER_URL = environment.apiUrl;
  private readonly DOCTORS_URL = this.SERVER_URL + '/doctors';
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

  getDoctorInfo(): Observable<Response<Doctor>> {
    const GET_DOCTOR_INFO_URL = this.SERVER_URL + '/doctors';
    return this.http
      .get<HttpResponse<Response<Doctor>>>(GET_DOCTOR_INFO_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('GET_DOCTOR_INFO'))
      );
  }

  getProfileImage(img): string {
    if (!!img) {
      return this.SERVER_URL + '/' + img;
    }
    return this.SERVER_URL + '/photos/user.png';
  }

  getOffice(id): Observable<Response<Office>> {
    const GET_OFFICE_INFO_URL = this.SERVER_URL + '/offices/' + id;
    return this.http
      .get<HttpResponse<Response<Office>>>(GET_OFFICE_INFO_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('GET_OFFICE_INFO'))
      );
  }

  saveUser(user): Observable<Response<User>> {
    const UPDATE_USER_INFO_URL = this.SERVER_URL + '/users';
    return this.http
      .put<HttpResponse<Response<User>>>(UPDATE_USER_INFO_URL, user, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('UPDATE_USER_INFO'))
      );
  }

  updatePhoto(file): Observable<Response<any>> {
    const UPDATE_PHOTO_URL = this.SERVER_URL + '/users/update-photo';
    const formData = new FormData();
    const jwt = localStorage.getItem('Authorization');
    formData.append('photo', file, file.name);
    return this.http
      .put<HttpResponse<ArrayBuffer>>(UPDATE_PHOTO_URL, formData, {
        observe: 'response',
        headers: { Authorization: jwt },
      })
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('UPDATE_PHOTO'))
      );
  }

  updateDoctor(data): Observable<Response<Doctor>> {
    return this.http
      .put<HttpResponse<Response<Doctor>>>(this.DOCTORS_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('UPDATE_DOCTOR_INFO')
        )
      );
  }

  addDoctor(data): Observable<Response<Doctor>> {
    return this.http
      .post<HttpResponse<Response<Doctor>>>(this.DOCTORS_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(this.snackbarHandlerService.handleError('ADD_DOCTOR_INFO'))
      );
  }

  addOffice(data): Observable<Response<Office>> {
    const UPDATE_OFFICE_INFO_URL = this.SERVER_URL + '/offices';
    return this.http
      .post<HttpResponse<Response<Office>>>(UPDATE_OFFICE_INFO_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('UPDATE_OFFICE_INFO')
        )
      );
  }

  updateOffice(data): Observable<Response<any>> {
    const UPDATE_OFFICE_INFO_URL = this.SERVER_URL + '/offices';
    return this.http
      .put<HttpResponse<Response<any>>>(UPDATE_OFFICE_INFO_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('UPDATE_OFFICE_INFO')
        )
      );
  }

  removeOffice(): Observable<Response<any>> {
    const OFFICE_URL = this.SERVER_URL + `/offices`;
    return this.http
      .delete<HttpResponse<Response<any>>>(OFFICE_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('REMOVE_OFFICE_INFO')
        )
      );
  }

  getDoctorsWithoutOffice(name): Observable<Response<Doctor[]>> {
    const DOCTOR_URL = this.SERVER_URL + `/doctors/search/${name}`;
    return this.http
      .get<HttpResponse<Response<Doctor[]>>>(DOCTOR_URL, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        debounce(() => timer(2000)),
        catchError(
          this.snackbarHandlerService.handleError('SEARCH_DOCTORS_INFO')
        )
      );
  }

  inviteDoctor(data): Observable<Response<any>> {
    const INVITE_DOCTOR_URL = this.SERVER_URL + `/offices/invite`;
    return this.http
      .post<HttpResponse<Response<any>>>(INVITE_DOCTOR_URL, data, {
        observe: 'response',
        headers: new HttpHeaders(this.jsonAuthHeader()),
      })
      .pipe(
        first(),
        catchError(
          this.snackbarHandlerService.handleError('INVITE_DOCTOR_INFO')
        )
      );
  }
}
