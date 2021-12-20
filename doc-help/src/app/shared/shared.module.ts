import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DoctorCardInfoComponent } from './components/doctor-card-info/doctor-card-info.component';
import { GdprRegisterConsentDialogComponent } from './components/gdpr-register-consent-dialog/gdpr-register-consent-dialog.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LogoComponent,
    DoctorCardInfoComponent,
    GdprRegisterConsentDialogComponent,
    AuthDialogComponent,
    SignInComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [ LogoComponent, CommonModule, AgmCoreModule, AuthDialogComponent, MaterialModule ],
  entryComponents: [ SignInComponent, SignUpComponent ],
  providers: [],
})
export class SharedModule {}
