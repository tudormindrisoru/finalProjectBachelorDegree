import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-event-details-dialog',
  templateUrl: './calendar-event-details-dialog.component.html',
  styleUrls: ['./calendar-event-details-dialog.component.scss']
})
export class CalendarEventDetailsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CalendarEventDetailsDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
