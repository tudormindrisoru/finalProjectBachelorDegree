import {
  Schedule,
  Response,
  Vacation,
} from './../../../../shared/models/models';
import { HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from 'src/app/shared/services/schedule/schedule.service';
import { VacationService } from 'src/app/shared/services/vacation/vacation.service';
import { days } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-update-schedule-dialog',
  templateUrl: './update-schedule-dialog.component.html',
  styleUrls: ['./update-schedule-dialog.component.scss'],
})
export class UpdateScheduleDialogComponent implements OnInit {
  public scheduleList = [];
  public vacationList = [];

  scheduleFormGroup: FormGroup;
  vacationFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<UpdateScheduleDialogComponent>,
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private vacationService: VacationService
  ) {}

  // tslint:disable-next-line: typedef
  async ngOnInit() {
    await this.getAllScheduleIntervals();

    await this.getAllVacations();

    // this.initScheduleFormGroup();
  }

  async getAllScheduleIntervals() {
    this.scheduleService
      .getMySchedule()
      .subscribe((response: HttpResponse<Response<any>>) => {
        for (let index = 0; index < 7; index++) {
          this.scheduleList = [
            ...this.scheduleList,
            {
              weekDay: index,
              dayName: days[index],
              workingHours: '0h',
              intervals: [],
            },
          ];
        }
        if (response.body.success) {
          const { message } = response.body;
          Object.entries(response.body.message).forEach((entry) => {
            const [key, value] = entry;
            if (message[key].length > 0) {
              message[key].forEach((i: Schedule) => {
                if (!this.scheduleList[key].intervals) {
                  this.scheduleList[key].intervals = [];
                }
                this.scheduleList[key].intervals.push({
                  id: i.id,
                  start: i.startTime,
                  end: i.endTime,
                });
              });
            }
          });

          // for (const key in message) {

          // }
        }
        this.initScheduleFormGroup();
      });
  }

  initScheduleFormGroup(): void {
    this.scheduleFormGroup = this.fb.group({
      days: this.fb.array([]),
    });
    let days: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    this.scheduleList.forEach((element) => {
      let intervalsArray: FormArray = this.fb.array([]);
      if (!!element.intervals) {
        element.intervals.forEach((interval) => {
          intervalsArray.push(
            this.fb.group({
              id: this.fb.control(interval.id),
              start: this.fb.control(this.numberToHour(interval.start)),
              end: this.fb.control(this.numberToHour(interval.end)),
            })
          );
        });
      }
      days.push(
        this.fb.group({
          weekDay: this.fb.control(element.weekDay),
          dayName: this.fb.control(element.dayName),
          workingHours: this.fb.control(
            element.intervals
              ? this.scheduleService.calculateWorkingHoursLabel(
                  element.intervals
                )
              : '0h'
          ),
          intervals: intervalsArray,
        })
      );
    });
  }

  numberToHour = (time: number): Date => {
    let newDate = new Date();
    const hours = Math.floor(time / 60);
    const minutes = time - hours * 60;
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate;
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddInterval(dayIndex: number): void {
    const dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    const intervals: FormArray = dayList
      .at(dayIndex)
      .get('intervals') as FormArray;
    if (intervals) {
      intervals.push(
        this.fb.group({
          id: this.fb.control(-1),
          start: this.fb.control(''),
          end: this.fb.control(''),
        })
      );
    }
  }

  onRemoveInterval(dayIndex: number, intervalIndex: number): void {
    const dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    const intervals: FormArray = dayList
      .at(dayIndex)
      .get('intervals') as FormArray;
    const intervalId = intervals.at(intervalIndex).get('id').value;

    this.scheduleService
      .deleteScheduleInterval(intervalId)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body?.success) {
          intervals.removeAt(intervalIndex);
          this.scheduleList[dayIndex].intervals = this.scheduleList[
            dayIndex
          ].intervals.filter((i: Schedule) => i.id !== intervalId);
          dayList
            .at(dayIndex)
            .get('workingHours')
            .setValue(
              this.scheduleService.calculateWorkingHoursLabel(
                this.scheduleList[dayIndex].intervals
              )
            );
        }
      });
  }

  onSaveInterval(dayIndex: number, intervalIndex: number): void {
    const day = (this.scheduleFormGroup.get('days') as FormArray).at(dayIndex);
    const intervals = day.get('intervals') as FormArray;
    const interval = intervals.value[intervalIndex];
    if (!this.scheduleService.isScheduleIntervalValid(interval, intervals)) {
      return;
    }
    interval.weekDay = dayIndex;
    interval.start = this.scheduleService.hourToNumber(interval.start);
    interval.end = this.scheduleService.hourToNumber(interval.end);
    this.scheduleService
      .saveScheduleInterval(interval)
      .subscribe((response: HttpResponse<Response<Schedule>>) => {
        if (response.body.success) {
          if (intervals.at(intervalIndex).get('id').value < 0) {
            intervals.controls[intervalIndex]
              .get('id')
              .setValue(response.body.message.id);
            intervals.controls[intervalIndex]
              .get('start')
              .setValue(this.numberToHour(response.body.message.startTime));
            intervals.controls[intervalIndex]
              .get('end')
              .setValue(this.numberToHour(response.body.message.endTime));
            this.scheduleList[dayIndex].intervals.push({
              id: response.body.message.id,
              start: response.body.message.startTime,
              end: response.body.message.endTime,
            });

            this.scheduleList[dayIndex].workingHours =
              this.scheduleService.calculateWorkingHoursLabel(
                this.scheduleList[dayIndex].intervals
              );
          } else {
            this.scheduleList[dayIndex].intervals[intervalIndex].start =
              interval.start;
            this.scheduleList[dayIndex].intervals[intervalIndex].end =
              interval.end;
            this.scheduleList[dayIndex].workingHours =
              this.scheduleService.calculateWorkingHoursLabel(
                this.scheduleList[dayIndex].intervals
              );
          }
          day
            .get('workingHours')
            .setValue(
              this.scheduleService.calculateWorkingHoursLabel(
                this.scheduleList[dayIndex].intervals
              )
            );
        }
      });
  }

  isScheduleSaved(dayIndex: number, intervalIndex: number): boolean {
    const intervals = (this.scheduleFormGroup.get('days') as FormArray)
      .at(dayIndex)
      .get('intervals') as FormArray;
    const interval = intervals.at(intervalIndex);

    if (interval.get('id').value === -1) {
      return false;
    }
    const fcStart = interval.get('start').value;
    const fcEnd = interval.get('end').value;
    if (
      this.scheduleService.hourToNumber(fcStart) !==
        this.scheduleList[dayIndex].intervals[intervalIndex].start ||
      this.scheduleService.hourToNumber(fcEnd) !==
        this.scheduleList[dayIndex].intervals[intervalIndex].end
    ) {
      return false;
    }
    return true;
  }

  isAddScheduleIntervalDisabled = (dayIndex: number): boolean => {
    return (this.scheduleFormGroup.get('days') as FormArray)
      .at(dayIndex)
      .get('intervals')
      .value.find((i: Schedule) => i.id === -1);
  };

  initVacationFormGroup(): void {
    const intervalArray = this.fb.array([]);
    this.vacationList.forEach((interval) => {
      intervalArray.push(
        this.fb.group({
          id: this.fb.control(interval.id),
          startDate: this.fb.control(new Date(interval.startDate)),
          endDate: this.fb.control(new Date(interval.endDate)),
        })
      );
    });
    this.vacationFormGroup = this.fb.group({
      intervals: intervalArray,
    });
  }

  async getAllVacations() {
    this.vacationService
      .getMyVacations()
      .subscribe((response: HttpResponse<Response<Vacation[]>>) => {
        Object.entries(response.body.message).forEach((entry) => {
          const [_, value] = entry;
          this.vacationList.push(value);
        });
        this.initVacationFormGroup();
      });
  }

  onAddVacation(): void {
    const intervals: FormArray = this.vacationFormGroup.get(
      'intervals'
    ) as FormArray;
    intervals.push(
      this.fb.group({
        id: this.fb.control(-1),
        startDate: this.fb.control(''),
        endDate: this.fb.control(''),
      })
    );
  }

  onSaveVacation(index): void {
    const intervals: FormArray = this.vacationFormGroup.get(
      'intervals'
    ) as FormArray;
    const interval = intervals.at(index).value;
    this.vacationService
      .saveVacation(interval)
      .subscribe((response: HttpResponse<Response<Vacation>>) => {
        if (response.body.success) {
          if (interval.id < 0) {
            // create vacation
            this.vacationList.push(response.body.message);
            intervals.at(index).get('id').setValue(response.body.message.id);
          } else {
            // update vacation
            const vIndex = this.vacationList.findIndex(
              (e) => e.id === interval.id
            );
            if (vIndex > -1) {
              this.vacationList[vIndex].startDate =
                response.body.message.starDate;
              this.vacationList[vIndex].endDate = response.body.message.endDate;
            }
          }
        }
      });
  }

  onRemoveVacation(vacationIndex: number): void {
    const intervals: FormArray = this.vacationFormGroup.get(
      'intervals'
    ) as FormArray;
    const id = intervals.at(vacationIndex).get('id').value;
    this.vacationService
      .removeVacation(id)
      .subscribe((response: HttpResponse<Response<string>>) => {
        if (response.body.success) {
          intervals.removeAt(vacationIndex);
          const vacationIndexInList = this.vacationList.findIndex(
            (v) => v.id === id
          );

          if (vacationIndexInList) {
            this.vacationList.splice(vacationIndexInList, 1);
          }
        }
      });
  }

  isVacationSaved(index: number): boolean {
    const intervals = this.vacationFormGroup.get('intervals') as FormArray;
    const interval = intervals.at(index) as FormGroup;

    if (interval.value.id === -1) {
      return false;
    }
    const fcStart = new Date(interval.value.startDate);
    const fcEnd = new Date(interval.value.endDate);
    if (
      fcStart.getTime() !==
        new Date(this.vacationList[index].startDate).getTime() ||
      fcEnd.getTime() !== new Date(this.vacationList[index].endDate).getTime()
    ) {
      return false;
    }
    return true;
  }

  isAddVacationIntervalDisabled = (): boolean => {
    return (this.vacationFormGroup.get('intervals') as FormArray).value.find(
      (i: Vacation) => i.id === -1
    );
  };
}
