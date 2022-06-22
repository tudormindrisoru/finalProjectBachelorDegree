import { AppointmentRequestsComponent } from '../../features/appointment-requests/appointment-requests.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from 'src/app/features/appointments/appointments.component';
import { PatientsComponent } from 'src/app/features/patients/patients.component';
import { ProfileComponent } from 'src/app/features/profile/profile.component';
import { DoctorGuard } from 'src/app/shared/services/guard/doctor.guard';
import { DashboardComponent } from './dashboard.component';

const DASHBOARD_ROUTES = [
  { path: '', redirectTo: 'profile' },
  {
    path: 'appointments',
    component: AppointmentsComponent,
    canLoad: [DoctorGuard],
    canActivate: [DoctorGuard],
  },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'patients',
    component: PatientsComponent,
    canLoad: [DoctorGuard],
    canActivate: [DoctorGuard],
  },
  { path: 'appointment-requests', component: AppointmentRequestsComponent },
];

const routes: Routes = [
  { path: '', component: DashboardComponent, children: DASHBOARD_ROUTES },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
