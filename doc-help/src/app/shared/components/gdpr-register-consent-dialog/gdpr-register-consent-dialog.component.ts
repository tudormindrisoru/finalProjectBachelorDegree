import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gdpr-register-consent-dialog',
  templateUrl: './gdpr-register-consent-dialog.component.html',
  styleUrls: ['./gdpr-register-consent-dialog.component.scss']
})
export class GdprRegisterConsentDialogComponent implements OnInit {

  _consentChecked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<GdprRegisterConsentDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  get consentChecked(): boolean {
    return this._consentChecked || undefined;
  }

  set consentChecked(checked) {
    this._consentChecked = checked;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConsentSubmit(): void {
    console.log('consent submit');
  }

  consentCheckboxToggle(event: any) {
    this.consentChecked = event.checked;
  }
}
