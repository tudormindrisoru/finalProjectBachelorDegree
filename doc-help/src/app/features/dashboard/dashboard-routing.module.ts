import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'events', component: DashboardComponent },
  { path: 'account-settings', component: DashboardComponent },
  { path: 'patients', component: DashboardComponent },
  { path: '404-error', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404-error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
