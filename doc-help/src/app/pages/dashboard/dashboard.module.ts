import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentsComponent } from 'src/app/features/appointments/appointments.component';
import { ProfileComponent } from 'src/app/features/profile/profile.component';
import { PatientsComponent } from 'src/app/features/patients/patients.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SidenavItemListComponent } from 'src/app/shared/components/sidenav-item-list/sidenav-item-list.component';
import { AddOfficeDialogComponent } from 'src/app/features/profile/components/add-office-dialog/add-office-dialog.component';
import { JoinOfficeDialogComponent } from 'src/app/features/profile/components/join-office-dialog/join-office-dialog.component';



@NgModule({
  declarations: [ 
    DashboardComponent,
    AppointmentsComponent,
    ProfileComponent,
    PatientsComponent,
    SidenavItemListComponent,
    AddOfficeDialogComponent,
    JoinOfficeDialogComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ],
})
export class DashboardModule { }
