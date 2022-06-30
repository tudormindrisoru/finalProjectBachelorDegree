import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from '../models/models';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SnackbarHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  // tslint:disable-next-line: typedef
  handleError<T>(operation = 'operation', result?: T | HttpErrorResponse) {
    return (error: any): Observable<T> => {
      this.snackBar.open(
        error.status + ' ' + error?.error?.message
          ? error?.error?.message
          : error?.statusText,
        'Ok',
        {
          duration: 2000,
          panelClass: ['red-snackbar'],
        }
      );
      return of(result as T);
    };
  }

  handleSuccess<T>(result?: Response<T>): void {
    this.snackBar.open(result.message.toString(), 'Ok', {
      duration: 2000,
      panelClass: ['green-snackbar'],
    });
  }

  handleInfo(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 2000,
      panelClass: ['blue-snackbar'],
    });
  }
}
