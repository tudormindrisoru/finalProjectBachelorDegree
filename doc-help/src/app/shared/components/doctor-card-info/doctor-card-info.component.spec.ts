import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCardInfoComponent } from './doctor-card-info.component';

describe('DoctorCardInfoComponent', () => {
  let component: DoctorCardInfoComponent;
  let fixture: ComponentFixture<DoctorCardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorCardInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
