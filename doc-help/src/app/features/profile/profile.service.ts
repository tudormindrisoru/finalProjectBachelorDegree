import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardModule } from 'src/app/pages/dashboard/dashboard.module';

@Injectable({
  providedIn: DashboardModule
})
export class ProfileService {

  constructor(
    private _http: HttpClient,
  ) { }
}
