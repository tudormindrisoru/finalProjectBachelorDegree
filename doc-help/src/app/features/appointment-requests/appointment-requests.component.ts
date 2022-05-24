import { Component, OnInit } from '@angular/core';
import { cityList, specialtyList } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-appointment-requests',
  templateUrl: './appointment-requests.component.html',
  styleUrls: ['./appointment-requests.component.scss'],
})
export class AppointmentRequestsComponent implements OnInit {
  cityList: string[];
  specialtyList: string[];
  constructor() {
    this.cityList = cityList;
    this.specialtyList = specialtyList;
  }

  ngOnInit(): void {}
}
