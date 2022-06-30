import { VacationService } from 'src/app/shared/services/vacation/vacation.service';
import { ScheduleService } from 'src/app/shared/services/schedule/schedule.service';
import { AppointmentsService } from 'src/app/shared/services/appointments/appointments.service';
import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  cityList,
  specialtyList,
  days,
} from 'src/app/shared/constants/constants';

import {
  Response,
  Office,
  Doctor,
  Schedule,
  Vacation,
} from 'src/app/shared/models/models';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentRequestDialogComponent } from 'src/app/shared/components/appointment-request-dialog/appointment-request-dialog.component';
import { Store } from '@ngxs/store';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-appointment-requests',
  templateUrl: './appointment-requests.component.html',
  styleUrls: ['./appointment-requests.component.scss'],
})
export class AppointmentRequestsComponent implements OnInit {
  cityList: string[];
  specialtyList: string[];
  officeList: Office[];
  doctorList: Doctor[];
  filteredDoctors: Doctor[];
  isDoctorSelected: boolean = false;
  selectedDoctor: any;
  selectedOffice: any;
  minDate: Date;
  doctor: Doctor;
  lastAppointments: any;
  ratings: any;

  @ViewChild('officeControl') officeControl: ElementRef;
  @ViewChild('specialtyControl') specialtyControl: ElementRef;
  @ViewChild('doctorControl') doctorControl: ElementRef;

  _isSpecialtyFieldDisabled: boolean = true;
  _isOfficeFieldDisabled: boolean = true;
  _isDoctorFieldDisabled: boolean = true;

  get isSpecialtyFieldDisabled(): boolean {
    return this._isSpecialtyFieldDisabled;
  }

  get isOfficeFieldDisabled(): boolean {
    return this._isOfficeFieldDisabled;
  }

  get isDoctorFieldDisabled(): boolean {
    return this._isDoctorFieldDisabled;
  }

  get selectedDoctorsReviewAveragePoints(): number | undefined {
    return +this.selectedDoctor.reviewAverage > -1
      ? +this.selectedDoctor.reviewAverage
      : undefined;
  }

  set isOfficeFieldDisabled(value) {
    this._isOfficeFieldDisabled = value;
  }

  set isSpecialtyFieldDisabled(value) {
    this._isSpecialtyFieldDisabled = value;
  }

  set isDoctorsFieldDisabled(value) {
    this._isDoctorFieldDisabled = value;
  }

  constructor(
    private appointmentsService: AppointmentsService,
    private scheduleService: ScheduleService,
    private store: Store,
    private profileService: ProfileService,
    private vacationService: VacationService,

    public dialog: MatDialog
  ) {
    this.cityList = cityList;
    this.specialtyList = specialtyList;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.store
      .select((state) => state.doctor)
      .pipe(first())
      .subscribe((doctor) => (this.doctor = doctor));
    this.appointmentsService
      .getCityOptions()
      .subscribe((response: HttpResponse<Response<any[]>>) => {
        if (response.body.success) {
          this.cityList = response.body.message;
        }
      });

    this.appointmentsService
      .getLastFiveAppointments()
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success) {
          this.lastAppointments = response.body.message;
          let reviews = '';
          response.body.message.forEach((elem) => {
            if (!!elem.reviewId) {
              reviews += `,${elem.reviewId}`;
            }
          });
          reviews = reviews.slice(1);

          if (reviews !== '') {
            this.appointmentsService
              .getRatings(reviews)
              .subscribe((response: HttpResponse<Response<any>>) => {
                if (response.body.success) {
                  response.body.message.forEach((element) => {
                    const i = this.lastAppointments.findIndex(
                      (e) => e.reviewId === element.id
                    );
                    if (i !== -1) {
                      this.lastAppointments[i].points = element.points;
                    }
                  });
                }
              });
          }
        }
      });
  }

  onCitySelectionChange($event) {
    this.appointmentsService
      .getOfficeOptions($event)
      .subscribe((response: HttpResponse<Response<any[]>>) => {
        if (response.body.success) {
          this.officeList = response.body.message;
          this.isOfficeFieldDisabled = false;
        }
      });
  }

  onCitySelect(): void {
    if (this.officeControl && this.specialtyControl && this.doctorControl) {
      this.officeControl.nativeElement.setValue('');
      this.specialtyControl.nativeElement.setValue('');
      this.isSpecialtyFieldDisabled = true;
      this.doctorControl.nativeElement.setValue('');
      this.isDoctorsFieldDisabled = true;
    }
    this.selectedDoctor = null;
    this.selectedOffice = null;
  }

  onOfficeSelect(): void {
    if (this.specialtyControl && this.doctorControl) {
      this.specialtyControl.nativeElement.setValue('');
      this.doctorControl.nativeElement.setValue('');
      this.isDoctorsFieldDisabled = true;
    }
    this.selectedDoctor = null;
    this.selectedOffice = null;
  }

  onSpecialtySelect(): void {
    if (this.doctorControl) {
      this.doctorControl.nativeElement.setValue('');
    }
    this.selectedDoctor = null;
    this.selectedOffice = null;
  }

  onOfficeSelectionChange($event) {
    this.selectedOffice = $event.value;

    this.appointmentsService
      .getDoctorsOptions($event.value.id)
      .subscribe((response: HttpResponse<Response<any[]>>) => {
        if (response.body.success) {
          this.specialtyList = response.body.message.map(
            (element) => element.specialty
          );
          this.specialtyList = [...new Set(this.specialtyList)];
          this.doctorList = response.body.message;
          this.isSpecialtyFieldDisabled = false;
          this.selectedDoctor = null;
        }
      });
  }

  onSpecialtySelectionChange(value): void {
    this.filteredDoctors = this.doctorList.filter(
      (element: Doctor) => element.specialty === value
    );
    this.isDoctorsFieldDisabled = false;
    this.isDoctorSelected = false;
    this.selectedDoctor = null;
  }

  onDoctorSelectionChange(value): void {
    this.doctorControl.nativeElement?.setValue(
      value.firstName + ' ' + value.lastName
    );
    this.isDoctorSelected = true;
    this.selectedDoctor = value;

    this.scheduleService
      .getDoctorScheduleById(value.id)
      .subscribe((response: HttpResponse<Response<Schedule[]>>) => {
        if (response.body.success) {
          this.selectedDoctor.schedule = [];
          for (let obj in response.body.message) {
            this.selectedDoctor.schedule.push(response.body.message[obj]);
          }
        }
      });
    this.vacationService
      .getDoctorVacationByDoctorId(value.id)
      .subscribe((response: HttpResponse<Response<Vacation[]>>) => {
        if (response.body.success) {
          this.selectedDoctor.vacation = response.body.message;
        }
      });
  }

  getProfileImg(src): string {
    return this.profileService.getProfileImage(src);
  }

  timeConvert(value): string {
    const startHour =
      Math.floor(value.startTime / 60).toString().length === 2
        ? Math.floor(value.startTime / 60)
        : '0' + Math.floor(value.startTime / 60);
    const startMinutes =
      (value.startTime % 60).toString().length === 2
        ? value.startTime % 60
        : '0' + (value.startTime % 60);
    const endHour =
      Math.floor(value.endTime / 60).toString().length === 2
        ? Math.floor(value.endTime / 60)
        : '0' + Math.floor(value.startTime / 60);
    const endMinutes =
      (value.endTime % 60).toString().length === 2
        ? value.endTime % 60
        : '0' + (value.endTime % 60);
    return startHour + ':' + startMinutes + ' - ' + endHour + ':' + endMinutes;
  }

  convertTimeToText(obj): string {
    let res: string = days[obj[0].weekDay] + ': ';
    obj.forEach((elem, index) => {
      res += (index > 0 ? ', ' : '') + ' ' + this.timeConvert(elem);
    });
    return res;
  }

  scheduleFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).getTime();
    if (
      this.selectedDoctor?.vacation &&
      this.selectedDoctor?.vacation.length > 0
    ) {
      for (const v of this.selectedDoctor.vacation) {
        if (
          new Date(v.startDate).getTime() <= date &&
          new Date(v.endDate).getTime() >= date
        ) {
          return false;
        }
      }
    }

    if (
      this.selectedDoctor?.schedule &&
      this.selectedDoctor?.schedule.length > 0
    ) {
      const day = (d || new Date()).getDay();
      const weekDays = new Set<number>();
      this.selectedDoctor.schedule.forEach((s) =>
        weekDays.add(s[0].weekDay + 1)
      );
      return weekDays.has(day);
    }

    return true;
  };

  onDateChange($event) {
    if (this.selectedDoctor && this.selectedDoctor?.id) {
      this.selectedDoctor.selectedDate = $event.value;
      this.appointmentsService
        .getHoursSlotsOptions($event.value, this.selectedDoctor.id)
        .subscribe((response: HttpResponse<Response<any>>) => {
          if (response.body.success) {
            this.selectedDoctor.appointmentOptions = response.body.message.map(
              (elem) => {
                return {
                  label: this.timeConvert(elem),
                  startTime: elem.startTime,
                  endTime: elem.endTime,
                };
              }
            );
          }
        });
    }
  }

  openAppointmentRequestDialog(index) {
    this.dialog.open(AppointmentRequestDialogComponent, {
      width: '350px',
      data: {
        doctorId: this.selectedDoctor.id,
        officeId: this.selectedOffice.id,
        date: this.selectedDoctor.selectedDate,
        time: this.selectedDoctor.appointmentOptions[index],
      },
    });
  }

  onRatingChange(a, v) {
    this.appointmentsService
      .setRating(a.id, v)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          const index = this.lastAppointments.findIndex(
            (elem) => elem.id === a.id
          );
          if (index !== -1) {
            this.lastAppointments[index].points = v;
          }
        }
      });
  }
}
