import { Calendar } from '@fullcalendar/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap'; // a plugin
import roLocale from '@fullcalendar/core/locales/es';
// import 'bootstrap/dist/css/bootstrap.css';
// import '@fortawesome/fontawesome-free/css/all.css';

import { MatDialog } from '@angular/material/dialog'
import { CalendarEventDetailsDialogComponent } from '../calendar-event-details-dialog/calendar-event-details-dialog.component';



@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  @Output() updateSchedule = new EventEmitter<Function>();
  
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
    locale: 'en',
    plugins: [ timeGridPlugin, interactionPlugin, bootstrapPlugin ],
    customButtons: {
      myCustomButton: {
        text: 'Update schedule',
        click: this.onUpdateSchedule.bind(this)
      }
    },
    headerToolbar: {
      start: 'title', // will normally be on the left. if RTL, will be on the right
      center: '',
      end: 'myCustomButton today prev,next' // will normally be on the right. if RTL, will be on the left
    },
    buttonText: {
      today: 'today',
      updateSchedule: 'Update schedule',
    },
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),
    events: [
      { title: 'Mindrisoru Tudor-Gabriel', start: '2021-05-28T10:30', end: '2021-05-28T12:00' },
      { title: 'Another patient', start: '2021-05-29T11:00', end: '2021-05-29T12:00' }
    ],
    height: 525,
    editable: false,
    eventDrop: function(eventDropInfo) {
      console.log(eventDropInfo);
    },
    allDaySlot: false,
    eventOverlap: false,
    defaultTimedEventDuration: '00:30',
    nowIndicator: true,
  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }
  
  handleEventClick(arg) {
    console.log(arg);
    this.onOpenEventDetailsDialog();
  }

  onOpenEventDetailsDialog(): void {
    const dialogRef = this.dialog.open(CalendarEventDetailsDialogComponent, {
      width: '400px',
      data: {name: 'Add office dialog'},
      disableClose: true,
    });
  }

  onUpdateSchedule(): void {
    this.updateSchedule.emit();
  }
}
