import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MainComponent } from './pages/main/main.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './shared/services/guard/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    PageNotFoundComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // MaterialModule,
    SharedModule,
  ],
  providers: [ AuthGuard ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
