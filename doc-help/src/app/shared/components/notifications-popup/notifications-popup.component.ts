import { UpdateDoctorInfo } from './../../../store/actions/doctor.actions';
import { take } from 'rxjs/operators';
import { Office, Response, Doctor } from './../../models/models';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
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
import { Store } from '@ngxs/store';
import { UpdateOfficeInfo } from 'src/app/store/actions/office.actions';

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
  invitations: any[];
  removedAppointments = [];
  removeInvitations = [];

  constructor(
    public dialogRef: MatDialogRef<NotificationsPopupComponent>,
    private appointmentsService: AppointmentsService,
    private notificationService: NotificationService,
    private profileService: ProfileService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: { appointments: Appointment[]; invitations: any[] }
  ) {
    this.appointments = data.appointments;
    this.invitations = data.invitations;
  }

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close({
      removeAppointmentNotifications: this.removedAppointments,
      removeOfficeInvitationNotifications: this.removeInvitations,
    });
  }

  getProfileImg(src: string | undefined): string {
    return this.profileService.getProfileImage(src);
  }

  onAcceptAppointmentRequest(id: number): void {
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

          this.removedAppointments.push(id);
        }
      });
  }

  onRejectAppointmentRequest(id: number): void {
    this.appointmentsService
      .rejectAppointment(id)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          const index = this.appointments.findIndex(
            (element: Appointment) => element.id === id
          );

          if (index !== -1) {
            this.appointments = this.appointments.filter((a) => a.id !== id);
          }
          this.removedAppointments.push(id);
        }
      });
  }

  onInvitationAccept(id: number): void {
    this.notificationService
      .respondToOfficeInvitation(1, id)
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success) {
          const officeId = response.body.message?.officeId;
          this.profileService
            .getOffice(officeId)
            .subscribe((response: HttpResponse<Response<Office>>) => {
              if (response.body.success) {
                this.store.dispatch(
                  new UpdateOfficeInfo(response.body.message)
                );
                this.store
                  .select((state) => state.doctor)
                  .pipe(take(1))
                  .subscribe((doctor) => {
                    const doc = JSON.parse(JSON.stringify(doctor));
                    doc.officeId = response.body.message.id;
                    this.store.dispatch(new UpdateDoctorInfo(doc));
                  });
              }
            });
          this.removeInvitations = JSON.parse(JSON.stringify(this.invitations));
          this.invitations = [];
        }
      });
  }

  onInvitationReject(id: number): void {
    this.notificationService
      .respondToOfficeInvitation(0, id)
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success) {
          this.removeInvitations = this.invitations;
          this.invitations = [];
        }
      });
  }
}
