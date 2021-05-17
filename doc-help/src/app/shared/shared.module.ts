import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { SecretKeys } from 'src/environments/secret-keys';


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
      apiKey: SecretKeys.prototype.googleMapsKey,
      
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