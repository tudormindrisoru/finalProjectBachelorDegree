import { Store } from '@ngxs/store';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { HttpResponse } from '@angular/common/http';
import { NotificationService } from './../../services/notification/notification.service';
import {
  Appointment,
  Response,
  Notification,
  NOTIFICATION_TYPE,
} from 'src/app/shared/models/models';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav-item-list',
  templateUrl: './sidenav-item-list.component.html',
  styleUrls: ['./sidenav-item-list.component.scss'],
})
export class SidenavItemListComponent implements OnInit, OnDestroy {
  @Input() useLabels: boolean;
  @Input() openAction: boolean;
  @Output() toggleEvent = new EventEmitter();

  private subscriber;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private appointmentService: AppointmentsService,
    private store: Store
  ) {}

  itemList = [];
  toggleButton = {};
  pendingAppointments: Appointment[];
  user;

  ngOnInit(): void {
    this.store
      .select((state) => state.user)
      .pipe(take(1))
      .subscribe((user) => (this.user = user ?? null));
    console.log(this.user);
    this.notificationService
      .getPendingAppointments()
      .subscribe((response: HttpResponse<Response<Appointment[]>>) => {
        if (response.body.success) {
          this.pendingAppointments = response.body.message;
        }
      });
    this.itemList = [
      {
        icon: 'notifications',
        label: 'Notifications',
        onClick: () => this.toggleNotificationPopup(),
      },
      {
        icon: 'event_note',
        label: 'Appointments',
        onClick: () => this.redirectTo('dashboard/appointments'),
      },
      {
        icon: 'settings',
        label: 'Profile',
        onClick: () => this.redirectTo('dashboard/profile'),
      },
      {
        icon: 'people',
        label: 'Patient history',
        onClick: () => this.redirectTo('dashboard/patients'),
      },
    ];
    this.toggleButton = {
      icon: this.openAction ? 'navigate_next' : 'navigate_before',
      label: this.openAction ? 'Extend' : 'Collapse',
    };
    console.log('init subscriber');
    this.subscriber = this.notificationService
      .getEventSentEvent()
      .subscribe((data) => {
        const result: Notification = JSON.parse(JSON.parse(data.data).msg);
        if (!!result) {
          if (result.type === NOTIFICATION_TYPE.APPOINTMENT_REQUEST) {
            this.notificationService
              .getPendingAppointmentById(result.message.entryId)
              .subscribe((response: HttpResponse<Response<Appointment>>) => {
                if (response.body.success) {
                  this.pendingAppointments.unshift(response.body.message);
                }
              });
          }
          if (result.type === NOTIFICATION_TYPE.OFFICE_INVITE) {
            console.log('office invite');
          }
        }
      });
  }

  get isNotificationOpen(): boolean {
    return this.notificationService.isShown;
  }

  onToggleClick(): void {
    this.toggleEvent.emit();
  }

  redirectTo(url: string): void {
    this.router.navigate([`/${url}`]);
  }

  toggleNotificationPopup(): void {
    this.notificationService.onToggleNotifications();
  }

  onAcceptAppointmentRequest(id): void {
    this.appointmentService
      .approveAppointment(id)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          const index = this.pendingAppointments.findIndex(
            (element: Appointment) => element.id === id
          );
          if (index !== -1) {
            this.pendingAppointments = this.pendingAppointments.splice(
              index + 1,
              1
            );
          }
        }
      });
  }

  onRejectAppointmentRequest(id): void {
    this.appointmentService
      .rejectAppointment(id)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          console.log('notifications = ', this.pendingAppointments);
          const index = this.pendingAppointments.findIndex(
            (element: Appointment) => element.id === id
          );
          console.log(index);
          if (index !== -1) {
            this.pendingAppointments = this.pendingAppointments.splice(
              index + 1,
              1
            );
          }
        }
      });
  }

  onCloseNotificationPopup(_) {
    this.toggleNotificationPopup();
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
