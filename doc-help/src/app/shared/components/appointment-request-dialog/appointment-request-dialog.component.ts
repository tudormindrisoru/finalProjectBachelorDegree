import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { Response } from 'src/app/shared/models/models';

@Component({
  selector: 'app-appointment-request-dialog',
  templateUrl: './appointment-request-dialog.component.html',
  styleUrls: ['./appointment-request-dialog.component.scss'],
})
export class AppointmentRequestDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appointmentService: AppointmentsService
  ) {}

  ngOnInit(): void {}

  request(reason: string): void {
    const data = {
      reason,
      date: this.data.date,
      startTime: this.data.time.startTime,
      endTime: this.data.time.endTime,
      doctorId: this.data.doctorId,
      officeId: this.data.officeId,
    };

    this.appointmentService
      .requestAppointment(data)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
        }
      });
  }
}
