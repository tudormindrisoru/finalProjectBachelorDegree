import { Appointment, Response } from 'src/app/shared/models/models';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { UpdateScheduleDialogComponent } from './components/update-schedule-dialog/update-schedule-dialog.component';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[];
  constructor(
    public appointmentsService: AppointmentsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  onUpdateScheduleDialog() {
    const dialogRef = this.dialog.open(UpdateScheduleDialogComponent, {
      width: '600px',
      data: { name: 'open office dialog' },
      disableClose: true,
    });
  }
}
