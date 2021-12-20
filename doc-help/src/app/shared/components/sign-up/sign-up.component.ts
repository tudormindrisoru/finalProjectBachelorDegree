import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpFormGroup: FormGroup;
  signUpSecondFormGroup: FormGroup;
  _registerStep: number = 1;

  get rControls(): any { return this.signUpFormGroup.controls; }
  get r2Controls(): any { return this.signUpSecondFormGroup.controls; }
  constructor(
    private _formBuilder: FormBuilder,
  ) {

   }

  ngOnInit(): void {
    this.signUpFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [ Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required],
      gdpr: [false, (control) => {
        return !control.value ? { 'required': true } : null;
      } ]
    });

    this.signUpSecondFormGroup = this._formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6) ]]
    })
  }

  isFirstStepRegisterValid(): boolean {
    return this.signUpFormGroup.valid || false;
  }

  isSecondStepRegisterValid(): boolean {
    return this.signUpSecondFormGroup.valid || false;
  }

  get registerStep(): number {
    return this._registerStep || 1;
  }

  set registerStep(val) {
    this._registerStep = val;
  }

}
