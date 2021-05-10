import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-join-office-dialog',
  templateUrl: './join-office-dialog.component.html',
  styleUrls: ['./join-office-dialog.component.scss']
})
export class JoinOfficeDialogComponent implements OnInit {

  firstStepForm: FormGroup;
  secondStepForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<JoinOfficeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.firstStepForm = this._formBuilder.group({
      officeGenCode: ['', Validators.required]
    });
    this.secondStepForm = this._formBuilder.group({
      smsCode: ['', Validators.required]
    });
  }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
