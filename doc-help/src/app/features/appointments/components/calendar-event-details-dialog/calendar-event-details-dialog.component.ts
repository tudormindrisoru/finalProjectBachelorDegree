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

  get isTitleDisabled(): boolean {
    return this.data?.title !== '' || false;
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

  onChange(event) {
    console.log(event);
  }
  ngOnInit(): void {
    // this.data.start = this.data.start.split('+')[0];
    // if (!!this.data.id) {
    //   this.data.end = this.data.end.split('+')[0];
    // }
    console.log('AICII = ', this.data);
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
      startTime: new FormControl({
        value:
          this.data && this.data.start
            ? new Date(this.data.start)
            : new Date(new Date().getTime() + 1800000),
        disabled: this.areFieldsDisabled,
      }),
      endTime: new FormControl({
        value:
          this.data && this.data.end
            ? new Date(this.data.end)
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
      reason: new FormControl(
        this.data && this.data.reason ? this.data.reason : null
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
  dateToString(date): string {
    return (
      new Date(date.value).getFullYear() +
      '-' +
      (new Date(date.value).getMonth() + 1 < 10 ? '0' : '') +
      (new Date(date.value).getMonth() + 1) +
      '-' +
      (new Date(date.value).getDate() < 10 ? '0' : '') +
      new Date(date.value).getDate() +
      ' ' +
      new Date(date.value).toLocaleTimeString()
    );
  }

  updateAppointment(): void {
    const data = {
      id: this.appointmentControls.id.value,
      startDate: this.appointmentControls.startTime.value,
      endDate: this.appointmentControls.endTime.value,
      notes: this.appointmentControls.notes.value,
    };
    this.appointmentsService
      .updateApprovedAppointment(data)
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success) {
          this.dialogRef.close(data);
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
      let { startTime, endTime } = this.appointmentControls;
      startTime = this.dateToString(startTime.value);

      endTime = this.dateToString(endTime.value);
      console.log(startTime, endTime);

      const data = {
        patientId: this.selectedUser.id,
        startDate: startTime,
        endDate: endTime,
        notes: this.appointmentControls.notes.value,
      };
      console.log(data);
      this.appointmentsService
        .createApprovedAppointment(data)
        .subscribe((response: HttpResponse<Response<any>>) => {
          console.log('responseeeeeeee');
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

  onDateChange(value): void {
    console.log(value);
    console.log(this.appointmentControls.startTime.value);
    let newStartDateTime = this.appointmentControls.startTime.value;
    newStartDateTime = new Date(newStartDateTime).setDate(
      new Date(value).getDate()
    );
    newStartDateTime = new Date(newStartDateTime).setMonth(
      new Date(value).getMonth()
    );
    newStartDateTime = new Date(newStartDateTime).setFullYear(
      new Date(value).getFullYear()
    );
    let newEndDateTime = this.appointmentControls.endTime.value;
    newEndDateTime = new Date(newEndDateTime).setDate(
      new Date(value).getDate()
    );
    newEndDateTime = new Date(newEndDateTime).setMonth(
      new Date(value).getMonth()
    );
    newEndDateTime = new Date(newEndDateTime).setFullYear(
      new Date(value).getFullYear()
    );

    this.appointmentControls.startTime.setValue(new Date(newStartDateTime));
    this.appointmentControls.endTime.setValue(new Date(newEndDateTime));
    console.log(2);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
