import { MapComponent } from './../../shared/components/map/map.component';
import { PatientsService } from './../../features/patients/patients.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentsComponent } from 'src/app/features/appointments/appointments.component';
import { ProfileComponent } from 'src/app/features/profile/profile.component';
import { PatientsComponent } from 'src/app/features/patients/patients.component';
import { SidenavItemListComponent } from 'src/app/shared/components/sidenav-item-list/sidenav-item-list.component';
import { AddOfficeDialogComponent } from 'src/app/features/profile/components/add-office-dialog/add-office-dialog.component';
import { CalendarViewComponent } from 'src/app/features/appointments/components/calendar-view/calendar-view.component';
import { UpdateScheduleDialogComponent } from 'src/app/features/appointments/components/update-schedule-dialog/update-schedule-dialog.component';
import { NotificationsPopupComponent } from 'src/app/shared/components/notifications-popup/notifications-popup.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap'; // a plugin
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { CalendarEventDetailsDialogComponent } from 'src/app/features/appointments/components/calendar-event-details-dialog/calendar-event-details-dialog.component';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { ScheduleService } from 'src/app/shared/services/schedule/schedule.service';
import { MatTimepickerModule } from 'mat-timepicker';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AppointmentRequestsComponent } from 'src/app/features/appointment-requests/appointment-requests.component';

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
  bootstrapPlugin,
]);

@NgModule({
  declarations: [
    DashboardComponent,
    AppointmentsComponent,
    ProfileComponent,
    PatientsComponent,
    SidenavItemListComponent,
    CalendarViewComponent,
    NotificationsPopupComponent,
    AppointmentRequestsComponent,
    MapComponent,

    //DIALOGS
    AddOfficeDialogComponent,
    UpdateScheduleDialogComponent,
    CalendarEventDetailsDialogComponent,
  ],
  imports: [
    DashboardRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatTimepickerModule,
  ],
  providers: [
    PatientsService,
    AppointmentsService,
    ProfileService,
    ScheduleService,
    NotificationService,
  ],
})
export class DashboardModule {}
