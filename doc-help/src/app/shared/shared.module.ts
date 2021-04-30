import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { SidenavItemListComponent } from './components/sidenav-item-list/sidenav-item-list.component';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LogoComponent,
    SidenavItemListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    LogoComponent,
    SidenavItemListComponent
  ]
})
export class SharedModule { }
