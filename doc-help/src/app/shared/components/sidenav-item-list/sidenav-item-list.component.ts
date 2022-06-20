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
  appointments$;
  user;

  ngOnInit(): void {
    this.store
      .select((state) => state.user)
      .pipe(take(1))
      .subscribe((user) => (this.user = user ?? null));
    console.log(this.user);
    // this.notificationService
    //   .getPendingAppointments()
    //   .subscribe((response: HttpResponse<Response<Appointment[]>>) => {
    //     if (response.body.success) {
    //       this.pendingAppointments = response.body.message;
    //       this.notificationService.appointmentNotifications$.next(
    //         response.body.message
    //       );
    //     }
    //   });
    this.itemList = [
      {
        icon: 'medical_services',
        label: 'Cauta un doctor',
        onClick: () => this.redirectTo('dashboard/appointment-requests'),
      },
      {
        icon: 'event_note',
        label: 'Programari',
        onClick: () => this.redirectTo('dashboard/appointments'),
      },
      {
        icon: 'settings',
        label: 'Setari',
        onClick: () => this.redirectTo('dashboard/profile'),
      },
      {
        icon: 'people',
        label: 'Istoricul pacientilor',
        onClick: () => this.redirectTo('dashboard/patients'),
      },
    ];
    this.toggleButton = {
      icon: this.openAction ? 'navigate_next' : 'navigate_before',
      label: this.openAction ? 'Extend' : 'Collapse',
    };
  }

  get isNotificationOpen(): boolean {
    return this.notificationService.isShown;
  }

  redirectTo(url: string): void {
    this.router.navigate([`/${url}`]);
  }

  toggleNotificationPopup(): void {
    this.notificationService.onToggleNotifications();
  }

  onToggleClick(): void {
    this.toggleEvent.emit();
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
