import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [
    LogoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB-1hp2yvF47M7VG_TmaJ7GyAt8f99_V8g',
      
    }),
    GooglePlaceModule
  ],
  exports: [
    LogoComponent,
    CommonModule,
    AgmCoreModule,
    GooglePlaceModule
  ]
})
export class SharedModule { }

// AIzaSyCXb9vv4E94_ejv6PnWaHsLAn6rUxJZQYA