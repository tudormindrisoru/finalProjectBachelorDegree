import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from './appointments.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  constructor(public appointmentsService: AppointmentsService) { }

  ngOnInit(): void {
  }

}
