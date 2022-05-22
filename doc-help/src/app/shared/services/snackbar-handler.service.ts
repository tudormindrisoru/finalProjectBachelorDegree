import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from '../models/models';
@Injectable({
  providedIn: 'root',
})
export class SnackbarHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  // tslint:disable-next-line: typedef
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      // console.log(error);
      this.snackBar.open(error.status + ' ' + error.statusText, 'Ok', {
        duration: 2000,
        panelClass: ['red-snackbar'],
      });
      return of(result as T);
    };
  }

  handleSuccess<T>(result?: Response<T>): void {
    console.log('snackbar call = ', result);
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
