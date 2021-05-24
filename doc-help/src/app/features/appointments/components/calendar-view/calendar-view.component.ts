import { Calendar } from '@fullcalendar/core';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap'; // a plugin

// import 'bootstrap/dist/css/bootstrap.css';
// import '@fortawesome/fontawesome-free/css/all.css';

import { MatDialog } from '@angular/material/dialog'
import { AppointmentDetailDialogComponent } from '../appointment-detail-dialog/appointment-detail-dialog.component';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) {
    const name = Calendar.name;
   }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    // themeSystem: 'bootstrap',
    plugins: [ timeGridPlugin, interactionPlugin, bootstrapPlugin ],
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),
    events: [
      { title: 'event 1', date: '2021-05-10' },
      { title: 'event 2', date: '2021-05-11' }
    ],
    height: 525,
    editable: true,
    // allDaySlot: false,
    eventOverlap: false,
  

  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }
  
  handleEventClick(arg) {
    console.log(arg);
    this.onOpenAppointmentDetailDialog();
  }

  onOpenAppointmentDetailDialog(): void {
    const dialogRef = this.dialog.open(AppointmentDetailDialogComponent, {
      width: '400px',
      data: {name: 'Add office dialog'},
      disableClose: true,
    });
  }


}
