import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprRegisterConsentDialogComponent } from './gdpr-register-consent-dialog.component';

describe('GdprRegisterConsentDialogComponent', () => {
  let component: GdprRegisterConsentDialogComponent;
  let fixture: ComponentFixture<GdprRegisterConsentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GdprRegisterConsentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprRegisterConsentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
