import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDoctor } from 'src/app/shared/shared.model';

export interface DialogData {
  canModify?: boolean;
  doctorInfo?: IDoctor;
}

@Component({
  selector: 'app-doctor-detail-dialog',
  templateUrl: './doctor-detail-dialog.component.html',
  styleUrls: ['./doctor-detail-dialog.component.scss']})

export class DoctorDetailDialogComponent implements OnInit {

  private _dialogData: DialogData | undefined;
  constructor(
    public dialogRef: MatDialogRef<DoctorDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData | undefined,
  ) { }

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  set dialogData(newValue: DialogData) { 
    this._dialogData = newValue;
  }

  get dialogData(): DialogData {
    return this._dialogData;
  }

  get doctorAge(): number | undefined{
    if(this.dialogData && this.dialogData.doctorInfo && this.dialogData.doctorInfo.birthDate) {
      return new Date(new Date(Date.now()).getTime() - this.dialogData.doctorInfo.birthDate.getTime()).getFullYear() - 1970;
    }
    return undefined; 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
