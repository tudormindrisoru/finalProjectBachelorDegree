import { UpdateDoctorInfo } from './../../../store/actions/doctor.actions';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsPopupComponent } from '../notifications-popup/notifications-popup.component';
import { Doctor, Office } from '../../models/models';
import { HttpResponse } from '@angular/common/http';
import {
  Response,
  Notification,
  Appointment,
  NOTIFICATION_TYPE,
} from 'src/app/shared/models/models';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  subscriber;
  pendingAppointments: Appointment[] = [];

  officeInvitations: any[] = [];
  office: Office;
  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private store: Store
  ) {}

  @Input() doctor: Doctor | undefined;

  get bedgeNumber(): number {
    return this.pendingAppointments.length + this.officeInvitations.length;
  }

  ngOnInit(): void {
    if (this.doctor.officeId) {
      this.notificationService
        .getPendingAppointments()
        .subscribe((response: HttpResponse<Response<Appointment[]>>) => {
          if (response.body.success) {
            this.pendingAppointments = response.body.message;
          }
        });
    }
    this.notificationService
      .getPendingOfficeInvitations()
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success) {
          this.officeInvitations = response.body.message;
        }
      });
    this.subscriber = this.notificationService
      .getEventSentEvent()
      .subscribe((data) => {
        const result: Notification = JSON.parse(JSON.parse(data.data).msg);
        if (!!result) {
          if (
            result.type === NOTIFICATION_TYPE.APPOINTMENT_REQUEST &&
            this.doctor.officeId
          ) {
            if (result.doctorId && result.doctorId === this.doctor.id) {
              this.notificationService
                .getPendingAppointmentById(result.entryId)
                .subscribe((response: HttpResponse<Response<Appointment>>) => {
                  if (response.body.success) {
                    this.pendingAppointments.unshift(response.body.message);
                  }
                });
            }
          }
          if (result.type === NOTIFICATION_TYPE.OFFICE_INVITE) {
            if (!!result.doctorId && result.doctorId === this.doctor.id) {
              this.notificationService
                .getPendingOfficeInvitationById(result.entryId)
                .subscribe((response: HttpResponse<Response<any>>) => {
                  if (response.body.success) {
                    this.officeInvitations.push(response.body.message);
                  }
                });
            }
          }
        }
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NotificationsPopupComponent, {
      width: '350px',
      data: {
        appointments: this.pendingAppointments,
        invitations: this.officeInvitations,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.removeAppointmentNotifications.length > 0) {
        this.pendingAppointments = this.pendingAppointments.filter(
          (a) => !result.removeAppointmentNotifications.includes(a.id)
        );
      }

      if (result.removeOfficeInvitationNotifications.length > 0) {
        this.officeInvitations = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
