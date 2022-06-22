import { OfficeState } from './../../../store/state/office.state';
import { DoctorState } from './../../../store/state/doctor.state';
import { UserState } from './../../../store/state/user.state';
import { Store } from '@ngxs/store';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { NotificationService } from './../../services/notification/notification.service';
import { Appointment, Office } from 'src/app/shared/models/models';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav-item-list',
  templateUrl: './sidenav-item-list.component.html',
  styleUrls: ['./sidenav-item-list.component.scss'],
})
export class SidenavItemListComponent implements OnInit {
  @Input() useLabels: boolean;
  @Input() openAction: boolean;
  @Output() toggleEvent = new EventEmitter();

  office: Office;
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private store: Store
  ) {
    this.store
      .select((state) => state.office)
      .subscribe((res) => {
        this.office = res;
        if (this.office) {
          this.itemList.splice(2, 0, {
            icon: 'event_note',
            label: 'Programari',
            onClick: () => this.redirectTo('dashboard/appointments'),
          });
          this.itemList.push({
            icon: 'people',
            label: 'Istoricul pacientilor',
            onClick: () => this.redirectTo('dashboard/patients'),
          });
        }
      });
  }

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
    this.itemList = [
      {
        icon: 'logout',
        label: 'Delogare',
        onClick: () => this.logout(),
      },
      {
        icon: 'medical_services',
        label: 'Caută un doctor',
        onClick: () => this.redirectTo('dashboard/appointment-requests'),
      },
      {
        icon: 'settings',
        label: 'Setări',
        onClick: () => this.redirectTo('dashboard/profile'),
      },
    ];

    this.toggleButton = {
      icon: this.openAction ? 'navigate_next' : 'navigate_before',
      label: this.openAction ? 'Extinde' : 'Minimizează',
    };
  }

  get isNotificationOpen(): boolean {
    return this.notificationService.isShown;
  }

  logout(): void {
    localStorage.removeItem(localStorage.getItem('Authorization'));
    this.store.reset(UserState);
    this.store.reset(DoctorState);
    this.store.reset(OfficeState);
    this.redirectTo('/');
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
}
