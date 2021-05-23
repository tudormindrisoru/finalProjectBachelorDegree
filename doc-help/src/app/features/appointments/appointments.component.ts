import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentsService } from './appointments.service';
import { UpdateScheduleDialogComponent } from './components/update-schedule-dialog/update-schedule-dialog.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  constructor(
    public appointmentsService: AppointmentsService,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  onUpdateScheduleDialog() {
    const dialogRef = this.dialog.open(UpdateScheduleDialogComponent, {
      width: '600px',
      data: {name: 'open office dialog' },
      disableClose: true,
    });
  }
  

}
