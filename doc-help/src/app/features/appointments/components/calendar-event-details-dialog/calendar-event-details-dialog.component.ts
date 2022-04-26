import { Response, User } from 'src/app/shared/models/models';
import { HttpResponse } from '@angular/common/http';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-calendar-event-details-dialog',
  templateUrl: './calendar-event-details-dialog.component.html',
  styleUrls: ['./calendar-event-details-dialog.component.scss'],
})
export class CalendarEventDetailsDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  filteredOptions$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  users: User[] = null;
  selectedUser: User;

  get image(): string {
    const path = this.appointmentControls.photo.value;
    return this.profileService.getProfileImage(path);
  }

  get patientPhone(): string {
    return this.appointmentControls.phone.value || null;
  }

  get appointmentControls(): any {
    return this.appointmentForm.controls;
  }

  get areFieldsDisabled(): boolean {
    if (this.data && !!this.data.start && !!this.data.end) {
      return (
        !!this.data.id &&
        (new Date() > new Date(this.data.start) ||
          new Date() > new Date(this.data.end))
      );
    }
    return true;
  }

  get isSaveButtonDisabled(): boolean {
    return !!this.selectedUser &&
      this.appointmentControls.title.value ===
        this.selectedUser.firstName + ' ' + this.selectedUser.lastName
      ? false
      : true;
  }

  constructor(
    public dialogRef: MatDialogRef<CalendarEventDetailsDialogComponent>,
    public profileService: ProfileService,
    public appointmentsService: AppointmentsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.start = this.data.start.split('+')[0];
    if (!!this.data.id) {
      this.data.end = this.data.end.split('+')[0];
    }
    console.log(this.data);
    this.appointmentForm = new FormGroup({
      id: new FormControl(this.data && this.data.id ? this.data.id : null),
      title: new FormControl({
        value: this.data && this.data.title ? this.data.title : '',
        disabled: this.areFieldsDisabled,
      }),
      startDate: new FormControl({
        value: this.data && this.data.start ? this.data.start : new Date(),
        disabled: this.areFieldsDisabled,
      }),
      endDate: new FormControl({
        value:
          this.data && this.data.end
            ? this.data.end
            : new Date(new Date().getTime() + 1800000),
        disabled: this.areFieldsDisabled,
      }),
      notes: new FormControl({
        value: this.data && this.data.notes ? this.data.notes : '',
        disabled: this.areFieldsDisabled,
      }),
      photo: new FormControl(
        this.data && this.data.photo ? this.data.photo : null
      ),
      phone: new FormControl(
        this.data && this.data.phone ? this.data.phone : null
      ),
    });
  }

  onSaveAppointment(): void {
    if (!!this.appointmentControls.id.value) {
      this.updateAppointment();
    } else {
      console.log('CREATE APPOINTMENT 1');
      this.createAppointment();
    }
  }

  updateAppointment(): void {
    const data = {
      id: this.appointmentControls.id.value,
      startDate: this.appointmentControls.startDate.value,
      endDate: this.appointmentControls.endDate.value,
      notes: this.appointmentControls.notes.value,
    };
    this.appointmentsService
      .updateApprovedAppointment(data)
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success) {
        }
      });
  }

  createAppointment(): void {
    console.log(
      !!this.selectedUser,
      !this.isSaveButtonDisabled,
      this.appointmentForm.valid
    );
    if (
      !!this.selectedUser &&
      !this.isSaveButtonDisabled &&
      this.appointmentForm.valid
    ) {
      let { startDate, endDate } = this.appointmentControls;
      startDate =
        startDate.value.split('T')[0] + ' ' + startDate.value.split('T')[1];
      endDate = endDate.value.split('T')[0] + ' ' + endDate.value.split('T')[1];

      console.log(startDate);
      console.log(endDate);
      const data = {
        patientId: this.selectedUser.id,
        startDate: startDate,
        endDate: endDate,
        notes: this.appointmentControls.notes.value,
      };
      this.appointmentsService
        .createApprovedAppointment(data)
        .subscribe((response: HttpResponse<Response<any>>) => {
          if (response.body.success) {
            console.log(response.body.message);
            this.dialogRef.close(response.body.message);
          } else {
            this.onNoClick();
          }
        });
    }
  }

  onDeleteAppointment(): void {
    console.log('DELETE');
  }

  onSearchPatients(e): void {
    const name = e.target.value;
    if (!!name) {
      this.appointmentsService
        .getUsersByName(e.target.value)
        .subscribe((response: HttpResponse<Response<User[]>>) => {
          if (response.body.success) {
            this.filteredOptions$.next(response.body.message);
            this.users = response.body.message;
          } else {
            this.filteredOptions$.next([]);
          }
        });
    } else {
      this.filteredOptions$.next([]);
    }
  }

  onSelectUser(user): void {
    this.selectedUser = user;
    this.appointmentControls.title.setValue(
      user.firstName + ' ' + user.lastName
    );
    this.appointmentControls.photo.setValue(user.photo);
    this.appointmentControls.phone.setValue(user.phone);
  }

  displayName(user: User): string {
    console.log('USER=', user);
    if (!!user.firstName && !!user.lastName) {
      return user.firstName + ' ' + user.lastName;
    } else {
      return user as string;
    }
  }

  getProfileImg(path: string): string {
    return this.profileService.getProfileImage(path);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
