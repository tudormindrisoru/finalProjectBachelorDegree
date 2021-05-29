import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientListTableComponent } from './patient-list-table.component';

describe('PatientListTableComponent', () => {
  let component: PatientListTableComponent;
  let fixture: ComponentFixture<PatientListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
