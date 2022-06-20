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
  doctor: Doctor;
  office: Office;
  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private store: Store
  ) {}

  @Input() doctorId: number | undefined;

  ngOnInit(): void {
    this.notificationService
      .getPendingAppointments()
      .subscribe((response: HttpResponse<Response<Appointment[]>>) => {
        if (response.body.success) {
          this.pendingAppointments = response.body.message;
        }
      });
    this.subscriber = this.notificationService
      .getEventSentEvent()
      .subscribe((data) => {
        const result: Notification = JSON.parse(JSON.parse(data.data).msg);
        if (!!result) {
          if (result.type === NOTIFICATION_TYPE.APPOINTMENT_REQUEST) {
            if (
              result.message.doctorId &&
              result.message.doctorId === this.doctorId
            ) {
              this.notificationService
                .getPendingAppointmentById(result.message.entryId)
                .subscribe((response: HttpResponse<Response<Appointment>>) => {
                  console.log(response.body);
                  if (response.body.success) {
                    this.pendingAppointments.unshift(response.body.message);
                  }
                });
            }
          }
          if (result.type === NOTIFICATION_TYPE.OFFICE_INVITE) {
            console.log('office invite');
          }
        }
      });
    console.log(this.subscriber);
  }

  openDialog(): void {
    console.log('pendings = ', this.pendingAppointments);
    const dialogRef = this.dialog.open(NotificationsPopupComponent, {
      width: '300px',
      data: {
        appointments: this.pendingAppointments,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.removedNotifications.length > 0) {
        this.pendingAppointments = this.pendingAppointments.filter(
          (a) => !result.removedNotifications.includes(a.id)
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
