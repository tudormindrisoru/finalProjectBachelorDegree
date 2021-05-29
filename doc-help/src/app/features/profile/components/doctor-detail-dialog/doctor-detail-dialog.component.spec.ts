import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDetailDialogComponent } from './doctor-detail-dialog.component';

describe('DoctorDetailDialogComponent', () => {
  let component: DoctorDetailDialogComponent;
  let fixture: ComponentFixture<DoctorDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
