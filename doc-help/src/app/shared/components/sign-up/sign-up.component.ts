import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpFormGroup: FormGroup;
  signUpSecondFormGroup: FormGroup;
  _registerStep: number = 1;

  get rControls(): any {
    return this.signUpFormGroup.controls;
  }
  get r2Controls(): any {
    return this.signUpSecondFormGroup.controls;
  }
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.signUpFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:(?:(?:00\s?|\+)40\s?|0)(?:7\d{2}\s?\d{3}\s?\d{3}|(21|31)\d{1}\s?\d{3}\s?\d{3}|((2|3)[3-7]\d{1})\s?\d{3}\s?\d{3}|(8|9)0\d{1}\s?\d{3}\s?\d{3}))$/
          ),
        ],
      ],
      gdpr: [
        false,
        (control) => {
          return !control.value ? { required: true } : null;
        },
      ],
    });

    this.signUpSecondFormGroup = this._formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
    });
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
