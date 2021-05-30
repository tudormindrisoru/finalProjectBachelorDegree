import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SecretKeys } from 'src/environments/secret-keys';
import { CreateAppointmentDialogComponent } from './components/create-appointment-dialog/create-appointment-dialog.component';
import { DoctorCardInfoComponent } from './components/doctor-card-info/doctor-card-info.component';
import { GdprRegisterConsentDialogComponent } from './components/gdpr-register-consent-dialog/gdpr-register-consent-dialog.component';

let secretKeys = new SecretKeys();
@NgModule({
  declarations: [
    LogoComponent,
    CreateAppointmentDialogComponent,
    DoctorCardInfoComponent,
    GdprRegisterConsentDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: secretKeys.googleMapsKey,
    }),
    GooglePlaceModule,
  ],
  exports: [LogoComponent, CommonModule, AgmCoreModule, GooglePlaceModule],
  providers: [SecretKeys],
})
export class SharedModule {}
