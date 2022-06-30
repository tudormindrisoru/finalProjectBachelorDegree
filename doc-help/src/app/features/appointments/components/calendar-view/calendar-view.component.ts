import { Patient } from './../../../patients/patients.service';
import { Calendar, ElementScrollController } from '@fullcalendar/core';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
    locale: 'ro',
    plugins: [timeGridPlugin, interactionPlugin, bootstrapPlugin],
    customButtons: {
      updateScheduleButton: {
        text: 'Actualizeaza program',
        click: this.onUpdateSchedule.bind(this),
      },
    },
    headerToolbar: {
      start: 'title', // will normally be on the left. if RTL, will be on the right
      center: '',
      end: 'updateScheduleButton today prev,next', // will normally be on the right. if RTL, will be on the left
    },
    buttonText: {
      today: 'astazi',
      updateSchedule: 'Actualizeaza program',
    },
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),

    events: (fetchInfo, successCallback, failureCallback) => {
      const interval = {
        startDate: new Date(fetchInfo.startStr),
        endDate: new Date(fetchInfo.endStr),
      };
      this.appointmentsService
        .getApprovedAppointments(interval)
        .subscribe((response: HttpResponse<Response<Appointment[]>>) => {
          if (response.body.success && response.body.message.length > 0) {
            const eventList = response.body.message.map(
              (element: Appointment) => {
                // tslint:disable-next-line: no-unused-expression

                return {
                  id: element.id.toString(),
                  title:
                    element.patient.firstName + ' ' + element.patient.lastName,
                  start: element.startDate,
                  end: element.endDate,
                  notes: element.notes,
                  photo: element.patient.photo,
                  phone: element.patient.phone,
                  reason: element.reason,
                };
              }
            );
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
    // },
    allDaySlot: false,
    eventOverlap: false,
    defaultTimedEventDuration: '00:30',
    nowIndicator: true,
  };

  ngOnInit(): void {}

  handleDateClick(arg) {
    if (new Date() < new Date(arg.dateStr)) {
      const data = {
        start: arg.dateStr,
        end: new Date(
          new Date(arg.date).getTime() +
            900000 -
            new Date(arg.date).getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('.')[0],
        id: null,
        title: '',
        notes: '',
        photo: null,
        phone: null,
      };
      this.onOpenEventDetailsDialog(data);
    }
  }

  handleEventClick(arg) {
    const data = {
      start: arg.event.startStr,
      end: arg.event.endStr,
      id: arg.event.id,
      title: arg.event.title,
      notes: arg.event.extendedProps.notes,
      photo: arg.event.extendedProps.photo,
      phone: arg.event.extendedProps.phone,
      reason: arg.event.extendedProps.reason,
    };
    this.onOpenEventDetailsDialog(data);
  }

  onOpenEventDetailsDialog(arg): void {
    const dialogRef = this.dialog.open(CalendarEventDetailsDialogComponent, {
      width: '450px',
      data: arg,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarComponent.getApi().refetchEvents();
      }
    });
  }

  onAddAppointment(appointmnet): void {
    const data = {
      start: appointmnet.startDate,
      end: appointmnet.endDate,
      id: appointmnet.id,
      title: appointmnet.patient.firstName + ' ' + appointmnet.patient.lastName,
      notes: appointmnet.notes,
      photo: appointmnet.patient.photo,
      phone: appointmnet.patient.phone,
    };
    this.eventList.push(data);
    this.calendarComponent.getApi().refetchEvents();
  }
  onUpdateSchedule(): void {
    this.updateSchedule.emit();
  }
}
