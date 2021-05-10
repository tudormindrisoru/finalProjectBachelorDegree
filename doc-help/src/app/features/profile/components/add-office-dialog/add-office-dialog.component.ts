import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-add-office-dialog',
  templateUrl: './add-office-dialog.component.html',
  styleUrls: ['./add-office-dialog.component.scss']
})
export class AddOfficeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddOfficeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder
    ) {}

    firstStepForm: FormGroup;
    secondStepForm: FormGroup;
    thirdStepForm: FormGroup;
    
    ngOnInit(): void {
      this.firstStepForm = this._formBuilder.group({
        officeName: ['', Validators.required]
      });
      this.secondStepForm = this._formBuilder.group({
        address: ['', Validators.required]
      });
      this.thirdStepForm = this._formBuilder.group({
        validationCode: ['', Validators.required]
      });
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
}
