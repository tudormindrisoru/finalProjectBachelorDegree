import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TouchSequence } from 'selenium-webdriver';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar-event-details-dialog',
  templateUrl: './calendar-event-details-dialog.component.html',
  styleUrls: ['./calendar-event-details-dialog.component.scss']
})
export class CalendarEventDetailsDialogComponent implements OnInit {


  appointmentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CalendarEventDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    console.log(this.data);
    this.appointmentForm = new FormGroup({
      id: new FormControl(this.data && this.data.id ? this.data.id : null),
      title: new FormControl(this.data && this.data.title ? this.data.title : null),
      startDate: new FormControl(this.data && this.data.start ? this.data.start : new Date()),
      endDate: new FormControl(this.data && this.data.end ? this.data.end : new Date()),
      notes: new FormControl(this.data && this.data.notes ? this.data.notes : null),
      photo: new FormControl(this.data && this.data.photo ? this.data.photo : null),
      phone: new FormControl(this.data && this.data.phone ? this.data.phone : null)
    });
  }
  onEventChange(event): void {
    console.log(event);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
