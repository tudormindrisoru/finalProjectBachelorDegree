import { Component, Inject, OnInit } from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit(): void {
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
}
