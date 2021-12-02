import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})

export class AuthDialogComponent implements OnInit {

  _step: number = 1;
  _signInType: string = 'Normal';
  _title: string;
  firstStep: boolean = true;
  smsFirstFormGroup: FormGroup;
  smsSecondFormGroup: FormGroup;
  smsStep = 1;
  get title(): string {
    return this._title || 'Sign in';
  }
  
  set title(newTitle) {
    this._title = newTitle;
  }

  get signInType(): string {
    return this._signInType;
  }

  set signInType(newType: string) {
    this._signInType = newType;
  }

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    this._title = data.title;
  }


  ngOnInit(): void {
    this.smsFirstFormGroup = this._formBuilder.group({
      phone: ["", Validators.required],
    });
    this.smsSecondFormGroup = this._formBuilder.group({
      code: ["", Validators.required],
    });
  }

  onSigninTypeChange(e: any): void {
    this.signInType = e.value;
  }
  onSmsSubmit(e): void {
    e.preventDefault();
    console.log(e);
  }

  sendPhone(e): void {
    e.preventDefault();
    this.smsStep = 2;
  }

  codeChangeFocus($event) {
    console.log($event.target.attributes.id.nodeValue);
    switch($event.target.attributes.id.nodeValue) {
      case 'first': {
        document.getElementById('second').focus();
        break;
      }
      case 'second': {
        document.getElementById('third').focus();
        break;
      }
      case 'third': {
        document.getElementById('fourth').focus();
        break;
      }
      case 'fourth': {
        document.getElementById('fifth').focus();
        break;
      }
      case 'fifth': {
        document.getElementById('sixth').focus();
        break;
      }
      case 'sixth': {
        // document.getElementById('second').focus();
        break;
      }
    }
  }

}
