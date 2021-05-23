import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/features/profile/components/add-office-dialog/add-office-dialog.component';

@Component({
  selector: 'app-update-schedule-dialog',
  templateUrl: './update-schedule-dialog.component.html',
  styleUrls: ['./update-schedule-dialog.component.scss']
})
export class UpdateScheduleDialogComponent implements OnInit {


  weekDaysList = [
    {
      weekDay: 0,
      dayName: 'Monday',
      intervals: [
        {
          start: "08:00",
          end: "09:00"
        },
        {
          start: "13:00",
          end: "17:00"
        }
      ]
    },
    {
      weekDay: 1,
      dayName: 'Tuesday',
      intervals: [
        {
          start: "08:00",
          end: "12:00"
        },
        {
          start: "13:00",
          end: "17:00"
        }
      ]
    },
    {
      weekDay: 2,
      dayName: 'Wednesday',
      intervals: [
        {
          start: "08:00",
          end: "12:00"
        },
        {
          start: "13:00",
          end: "17:00"
        }
      ]
    },
    {
      weekDay: 3,
      dayName: 'Thursday',
      intervals: [
        {
          start: "08:00",
          end: "12:00"
        },
        {
          start: "13:00",
          end: "17:00"
        }
      ]
    },
    {
      weekDay: 4,
      dayName: 'Friday',
      intervals: [
        {
          start: "08:00",
          end: "12:00"
        },
        {
          start: "13:00",
          end: "17:00"
        }
      ]
    },
    {
      weekDay: 5,
      dayName: 'Saturday',
      intervals: []
    },
    {
      weekDay: 6,
      dayName: 'Sunday',
      intervals: []
    },
  ]

  scheduleFormGroup: FormGroup;
  forwardArrow: boolean = window.innerWidth > 550 ? true : false;
  constructor(
    public dialogRef: MatDialogRef<UpdateScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initScheduleFormGroup();
  }

  
  initScheduleFormGroup(): void {
    this.scheduleFormGroup = this.fb.group({
      days: this.fb.array([])
    })
    let days: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    this.weekDaysList.forEach(element => {
      let intervalsArray: FormArray = this.fb.array([]);
      element.intervals.forEach(interval => {
        intervalsArray.push(this.fb.group({
          start: this.fb.control(interval.start),
          end: this.fb.control(interval.end)
        }))
      });
      days.push(this.fb.group({
        weekDay: this.fb.control(element.weekDay),
        dayName: this.fb.control(element.dayName),
        intervals: intervalsArray
      }))
    });
    
    console.log(this.scheduleFormGroup.value);
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
    let dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    let intervals: FormArray = dayList.at(dayIndex).get('intervals') as FormArray;
    intervals.push(this.fb.group({
      start: this.fb.control(''),
      end: this.fb.control('')
    }));
  }

  onRemoveIntarval(dayIndex: number, intervalIndex: number): void {
    let dayList: FormArray = this.scheduleFormGroup.get('days') as FormArray;
    let intervals: FormArray = dayList.at(dayIndex).get('intervals') as FormArray;
    intervals.removeAt(intervalIndex);
  }

  onSaveIntervals(dayIndex): void {
    console.log('saving intervals',dayIndex);
  }
}
