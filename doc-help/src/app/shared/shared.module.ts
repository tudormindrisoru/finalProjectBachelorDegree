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

@NgModule({
  declarations: [
    LogoComponent,
    DoctorCardInfoComponent,
    GdprRegisterConsentDialogComponent,
    AuthDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [LogoComponent, CommonModule, AgmCoreModule, AuthDialogComponent, MaterialModule],
  providers: [],
})
export class SharedModule {}
