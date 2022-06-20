import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { AppointmentRequestDialogComponent } from './components/appointment-request-dialog/appointment-request-dialog.component';

@NgModule({
  declarations: [
    LogoComponent,
    AuthDialogComponent,
    SignInComponent,
    SignUpComponent,
    ProfileDialogComponent,
    AppointmentRequestDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  exports: [LogoComponent, CommonModule, AuthDialogComponent, MaterialModule],
  entryComponents: [SignInComponent, SignUpComponent],
  providers: [],
})
export class SharedModule {}
