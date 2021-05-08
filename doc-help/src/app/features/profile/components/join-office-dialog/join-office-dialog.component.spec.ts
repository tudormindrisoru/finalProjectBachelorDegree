import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOfficeDialogComponent } from './join-office-dialog.component';

describe('JoinOfficeDialogComponent', () => {
  let component: JoinOfficeDialogComponent;
  let fixture: ComponentFixture<JoinOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinOfficeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
