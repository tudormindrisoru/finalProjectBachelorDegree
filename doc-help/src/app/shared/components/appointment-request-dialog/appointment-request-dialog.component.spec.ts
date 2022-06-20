import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRequestDialogComponent } from './appointment-request-dialog.component';

describe('AppointmentRequestDialogComponent', () => {
  let component: AppointmentRequestDialogComponent;
  let fixture: ComponentFixture<AppointmentRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
