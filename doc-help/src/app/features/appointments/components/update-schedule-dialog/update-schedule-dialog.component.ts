import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/features/profile/components/add-office-dialog/add-office-dialog.component';

@Component({
  selector: 'app-update-schedule-dialog',
  templateUrl: './update-schedule-dialog.component.html',
  styleUrls: ['./update-schedule-dialog.component.scss']
})
export class UpdateScheduleDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdateScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
