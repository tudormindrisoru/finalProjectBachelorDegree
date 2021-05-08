import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    public dialogRef: MatDialogRef<JoinOfficeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
  }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
