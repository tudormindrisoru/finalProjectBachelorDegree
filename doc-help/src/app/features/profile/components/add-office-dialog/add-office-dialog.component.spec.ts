import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOfficeDialogComponent } from './add-office-dialog.component';

describe('AddOfficeDialogComponent', () => {
  let component: AddOfficeDialogComponent;
  let fixture: ComponentFixture<AddOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOfficeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
