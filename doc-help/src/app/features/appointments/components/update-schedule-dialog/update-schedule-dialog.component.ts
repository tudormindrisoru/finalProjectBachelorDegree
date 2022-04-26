import { Schedule, Response } from './../../../../shared/models/models';
import { HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from 'src/app/shared/services/schedule/schedule.service';

@Component({
  selector: 'app-update-schedule-dialog',
  templateUrl: './update-schedule-dialog.component.html',
  styleUrls: ['./update-schedule-dialog.component.scss'],
})
export class UpdateScheduleDialogComponent implements OnInit {
  weekDaysList = [
    {
      weekDay: 0,
      dayName: 'Monday',
      intervals: [
        {
          start: '08:00',
          end: '09:00',
        },
        {
          start: '13:00',
          end: '17:00',
        },
      ],
    },
    {
      weekDay: 1,
      dayName: 'Tuesday',
      intervals: [
        {
          start: '08:00',
          end: '12:00',
        },
        {
          start: '13:00',
          end: '17:00',
        },
      ],
    },
    {
      weekDay: 2,
      dayName: 'Wednesday',
      intervals: [
        {
          start: '08:00',
          end: '12:00',
        },
        {
          start: '13:00',
          end: '17:00',
        },
      ],
    },
    {
      weekDay: 3,
      dayName: 'Thursday',
      intervals: [
        {
          start: '08:00',
          end: '12:00',
        },
        {
          start: '13:00',
          end: '17:00',
        },
      ],
    },
    {
      weekDay: 4,
      dayName: 'Friday',
      intervals: [
        {
          start: '08:00',
          end: '12:00',
        },
        {
          start: '13:00',
          end: '17:00',
        },
      ],
    },
    {
      weekDay: 5,
      dayName: 'Saturday',
      intervals: [],
    },
    {
      weekDay: 6,
      dayName: 'Sunday',
      intervals: [],
    },
  ];

  vacationList = [
    {
      startDate: '05/24/2021',
      endDate: '06/30/2021',
    },
  ];

  scheduleFormGroup: FormGroup;
  vacationFormGroup: FormGroup;
  forwardArrow: boolean = window.innerWidth > 550 ? true : false;
  constructor(
    public dialogRef: MatDialogRef<UpdateScheduleDialogComponent>,
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {}

  // tslint:disable-next-line: typedef
  async ngOnInit() {
    await this.getAllScheduleIntervals();
    this.initScheduleFormGroup();
    this.initVacationFormGroup();
  }

  async getAllScheduleIntervals() {
    const response = this.scheduleService
      .getMySchedule()
      .subscribe((response: HttpResponse<Response<Schedule[]>>) => {
        var days = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        this.weekDaysList = response.body.message.map((element) => {
          {
            weekDay: element.weekDay,
            dayName: days[element.weekDay],
            intervals: 
          }
        });
      });
  }

  initScheduleFormGroup(): void {
    this.scheduleFormGroup = this.fb.group({
      days: this.fb.array([]),
    });
    let days: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    this.weekDaysList.forEach((element) => {
      let intervalsArray: FormArray = this.fb.array([]);
      element.intervals.forEach((interval) => {
        intervalsArray.push(
          this.fb.group({
            start: this.fb.control(interval.start),
            end: this.fb.control(interval.end),
          })
        );
      });
      days.push(
        this.fb.group({
          weekDay: this.fb.control(element.weekDay),
          dayName: this.fb.control(element.dayName),
          intervals: intervalsArray,
        })
      );
    });

    // console.log(this.scheduleFormGroup.value);
  }

  initVacationFormGroup(): void {
    const intervalArray = this.fb.array([]);
    this.vacationList.forEach((interval) => {
      intervalArray.push(
        this.fb.group({
          startDate: this.fb.control(new Date(interval.startDate)),
          endDate: this.fb.control(new Date(interval.endDate)),
        })
      );
    });
    this.vacationFormGroup = this.fb.group({
      intervals: intervalArray,
    });
    console.log(this.vacationFormGroup.value);
  }

  getHoursPerDay(dayNumber: number): number {
    let dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    const selectedDay = dayList.value[dayNumber];
    // console.log(selectedDay);
    // let totalHours = 0;
    // selectedDay.forEach(element => {
    //   this.hourToNumber(element.start);
    // });
    // console.log(dayList);
    return 8;
  }

  hourToNumber(hour: string) {
    console.log(hour);
    // return 0;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddInterval(dayIndex: number): void {
    const dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    const intervals: FormArray = dayList
      .at(dayIndex)
      .get('intervals') as FormArray;
    intervals.push(
      this.fb.group({
        start: this.fb.control(''),
        end: this.fb.control(''),
      })
    );
  }

  onRemoveInterval(dayIndex: number, intervalIndex: number): void {
    const dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    const intervals: FormArray = dayList
      .at(dayIndex)
      .get('intervals') as FormArray;
    intervals.removeAt(intervalIndex);
  }

  onSaveIntervals(dayIndex: number): void {
    console.log('saving intervals', dayIndex);
  }

  onRemoveVacation(vacationIndex: number): void {
    const intervals: FormArray = this.vacationFormGroup.get(
      'intervals'
    ) as FormArray;
    intervals.removeAt(vacationIndex);
  }

  onAddVacation(): void {
    const intervals: FormArray = this.vacationFormGroup.get(
      'intervals'
    ) as FormArray;
    intervals.push(
      this.fb.group({
        startDate: this.fb.control(''),
        endDate: this.fb.control(''),
      })
    );
  }

  onSaveVacations(): void {
    const intervals: FormArray = this.vacationFormGroup.get(
      'intervals'
    ) as FormArray;
    console.log(intervals.value);
  }
}
