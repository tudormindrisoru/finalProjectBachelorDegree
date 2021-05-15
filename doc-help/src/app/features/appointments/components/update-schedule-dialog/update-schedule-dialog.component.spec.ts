import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScheduleDialogComponent } from './update-schedule-dialog.component';

describe('UpdateScheduleDialogComponent', () => {
  let component: UpdateScheduleDialogComponent;
  let fixture: ComponentFixture<UpdateScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateScheduleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
