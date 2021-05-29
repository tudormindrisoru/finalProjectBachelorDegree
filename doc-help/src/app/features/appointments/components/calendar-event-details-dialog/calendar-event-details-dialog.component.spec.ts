import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventDetailsDialogComponent } from './calendar-event-details-dialog.component';

describe('CalendarEventDetailsDialogComponent', () => {
  let component: CalendarEventDetailsDialogComponent;
  let fixture: ComponentFixture<CalendarEventDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarEventDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEventDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
