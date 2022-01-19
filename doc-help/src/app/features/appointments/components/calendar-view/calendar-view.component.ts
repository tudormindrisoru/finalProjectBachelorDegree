import { Calendar, ElementScrollController } from '@fullcalendar/core';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap'; // a plugin
import roLocale from '@fullcalendar/core/locales/es';
// import 'bootstrap/dist/css/bootstrap.css';
// import '@fortawesome/fontawesome-free/css/all.css';

import { MatDialog } from '@angular/material/dialog';
import { CalendarEventDetailsDialogComponent } from '../calendar-event-details-dialog/calendar-event-details-dialog.component';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { HttpResponse } from '@angular/common/http';
import { Appointment, Response } from 'src/app/shared/models/models';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit {


  constructor(
    public appointmentsService: AppointmentsService,
    public dialog: MatDialog
    ) {
    const name = Calendar.name;
  }
  @ViewChild('calendarComponent') calendarComponent: FullCalendarComponent;
  @Output() updateSchedule = new EventEmitter<Function>();
  eventList = [];
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    
    // themeSystem: 'bootstrap',
    locale: 'en',
    plugins: [timeGridPlugin, interactionPlugin, bootstrapPlugin],
    customButtons: {
      updateScheduleButton: {
        text: 'Update schedule',
        click: this.onUpdateSchedule.bind(this),
      },
    },
    headerToolbar: {
      start: 'title', // will normally be on the left. if RTL, will be on the right
      center: '',
      end: 'updateScheduleButton today prev,next', // will normally be on the right. if RTL, will be on the left
    },
    buttonText: {
      today: 'today',
      updateSchedule: 'Update schedule',
    },
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),

    events: ( fetchInfo, successCallback, failureCallback ) => {
      const interval = {
        'startDate': new Date(fetchInfo.startStr),
        'endDate': new Date(fetchInfo.endStr)
      };
      this.appointmentsService.getApprovedAppointments(interval).subscribe( (response: HttpResponse<Response<Appointment[]>>) => {
        if (response.body.success && response.body.message.length > 0) {
          const eventList = response.body.message.map((element: Appointment) => {
            // tslint:disable-next-line: no-unused-expression
            console.log(element.startDate.split('.')[0]);
            return {
              id: element.id.toString(),
              title: element.patient.firstName + ' ' + element.patient.lastName,
              start: element.startDate.split('.')[0],
              end: element.endDate.split('.')[0],
              notes: element.notes,
              photo: element.patient.phone,
              phone: element.patient.phone
            };
          });
          console.log(eventList);
          successCallback(eventList);
          // this.eventList = eventList;
          // this.calendarComponent.getApi().render();
        } else {
          // failureCallback();
          this.eventList = [];
          
        }
      });
    },

    height: 525,
    editable: false,
    // eventDrop: function (eventDropInfo) {
    //   console.log(eventDropInfo);
    // },
    allDaySlot: false,
    eventOverlap: false,
    defaultTimedEventDuration: '00:30',
    nowIndicator: true,
  };

  ngOnInit(): void {

  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
  }

  handleEventClick(arg) {
    console.log(arg.event.startStr);
    const data = {
      'start': arg.event.startStr,
      'end': arg.event.endStr,
      'id': arg.event.id,
      'title': arg.event.title,
      'notes': arg.event.notes,
      'photo': arg.event.photo,
      'phone': arg.event.phone
    }
    this.onOpenEventDetailsDialog(data);
  }



  onOpenEventDetailsDialog(arg): void {
    const dialogRef = this.dialog.open(CalendarEventDetailsDialogComponent, {
      width: '400px',
      data: { ...arg },
      disableClose: true,
    });
  }

  onUpdateSchedule(): void {
    this.updateSchedule.emit();
  }
}
