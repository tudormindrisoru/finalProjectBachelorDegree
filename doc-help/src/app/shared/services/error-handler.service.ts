import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private snackBar: MatSnackBar
  ) {

  }
  handleError<T>(operation='operation', result?:T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      console.log(error);
      this.snackBar.open(error.status + ' ' + error.statusText, 'Ok', {
        duration: 2000,
        panelClass: ['red-snackbar']
      });
      return of(result as T);
    }
  }
}
