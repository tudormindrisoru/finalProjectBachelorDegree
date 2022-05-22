import { environment } from 'src/environments/environment';
import { AuthService } from './shared/services/auth/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MainComponent } from './pages/main/main.component';
// import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './shared/services/guard/auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { UserState } from './store/state/user.state';
import { NgxsModule } from '@ngxs/store';
import { DoctorState } from './store/state/doctor.state';
import { OfficeState } from './store/state/office.state';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [AppComponent, MainComponent, PageNotFoundComponent],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // MaterialModule,
    SharedModule,
    HttpClientModule,
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsModule.forRoot([UserState, DoctorState, OfficeState]),
    AgmCoreModule.forRoot({
      apiKey: environment.agmAutocomplete,
      libraries: ['places'],
    }),
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
