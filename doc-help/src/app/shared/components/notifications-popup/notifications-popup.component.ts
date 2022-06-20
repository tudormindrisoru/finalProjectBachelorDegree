import { append } from '@ngxs/store/operators';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Appointment } from 'src/app/shared/models/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/features/profile/components/add-office-dialog/add-office-dialog.component';
import { AppointmentsService } from '../../services/appointments/appointments.service';
import { HttpResponse } from '@angular/common/http';
import { Response } from 'src/app/shared/models/models';

@Component({
  selector: 'app-notifications-popup',
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss'],
})
export class NotificationsPopupComponent implements OnInit {
  @Output() accept: EventEmitter<number> = new EventEmitter();
  @Output() reject: EventEmitter<number> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  appointments: Appointment[];
  removedNotifications = [];
  constructor(
    public dialogRef: MatDialogRef<NotificationsPopupComponent>,
    private appointmentsService: AppointmentsService,
    private profileService: ProfileService,
    @Inject(MAT_DIALOG_DATA) public data: { appointments: Appointment[] }
  ) {
    this.appointments = data.appointments;
  }

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close({ removedNotifications: this.removedNotifications });
  }

  getProfileImg(src: string | undefined): string {
    return this.profileService.getProfileImage(src);
  }

  onAcceptAppointmentRequest(id): void {
    this.appointmentsService
      .approveAppointment(id)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          const index = this.appointments.findIndex(
            (element: Appointment) => element.id === id
          );
          if (index !== -1) {
            this.appointments = this.appointments.filter((a) => a.id !== id);
          }
          console.log('popup 1, ', this.appointments);
          this.removedNotifications.push(id);
        }
      });
  }

  onRejectAppointmentRequest(id): void {
    this.appointmentsService
      .rejectAppointment(id)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          console.log('notifications = ', this.appointments);
          const index = this.appointments.findIndex(
            (element: Appointment) => element.id === id
          );
          console.log(index);
          if (index !== -1) {
            this.appointments = this.appointments.filter((a) => a.id !== id);
          }
          this.removedNotifications.push(id);
        }
      });
  }
}
