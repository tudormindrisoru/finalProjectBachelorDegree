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
import { JoinOfficeDialogComponent } from 'src/app/features/profile/components/join-office-dialog/join-office-dialog.component';
import { CalendarViewComponent } from 'src/app/features/appointments/components/calendar-view/calendar-view.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import timeGridPlugin from '@fullcalendar/timegrid';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin
]);

@NgModule({
  declarations: [ 
    DashboardComponent,
    AppointmentsComponent,
    ProfileComponent,
    PatientsComponent,
    SidenavItemListComponent,
    AddOfficeDialogComponent,
    JoinOfficeDialogComponent,
    CalendarViewComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
})
export class DashboardModule { }
