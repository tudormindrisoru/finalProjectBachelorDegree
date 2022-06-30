import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngxs/store';

import { SignInComponent } from './../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { AuthService } from '../../services/auth/auth.service';
import { UpdateUser } from 'src/app/store/actions/user.actions';
import { User, Response } from '../../models/models';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent implements OnInit {
  @ViewChild('signInComponent') signInComponent: SignInComponent;
  @ViewChild('signUpComponent') signUpComponent: SignUpComponent;

  smsStep: number = 1;
  _title: string;
  firstStep: boolean = true;
  signInType: string = 'Normal';

  get title(): string {
    return this._title || 'Logheaza-te';
  }
  set title(newTitle) {
    this._title = newTitle;
  }

  constructor(
    public dialogRef: MatDialogRef<AuthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private store: Store
  ) {
    this._title = data.title;
  }

  ngOnInit(): void {}

  changeSignInType(val) {
    this.signInType = val;
  }

  switchToSignUp(): void {
    this.title = 'Inregistreaza-te';
  }

  switchToSignIn(): void {
    this.title = 'Logheaza-te';
  }

  isNormalSignInFormValid(): boolean {
    if (this.signInComponent) {
      return (
        this.signInComponent.nFormGroup && this.signInComponent.nFormGroup.valid
      );
    }
    return false;
  }

  isSmsStepValid(): boolean {
    if (this.signInComponent) {
      if (this.signInComponent.smsStep === 1) {
        return this.signInComponent.smsFirstFormGroup.valid || false;
      } else {
        if (this.signInComponent.smsStep === 2) {
          return this.signInComponent.smsSecondFormGroup.valid || false;
        }
        return false;
      }
    }
    return false;
  }

  isFirstStepRegisterValid(): boolean {
    if (this.signUpComponent) {
      return this.signUpComponent.isFirstStepRegisterValid();
    }
    return false;
  }

  isSecondStepRegisterValid(): boolean {
    if (this.signUpComponent) {
      return this.signUpComponent.isSecondStepRegisterValid();
    }
    return false;
  }

  getSmsStep(): number {
    if (this.signInComponent) {
      return this.signInComponent.getSmsStep();
    }
    return 1;
  }

  getRegisterStep(): number {
    if (this.signUpComponent) {
      return this.signUpComponent.registerStep;
    }
    return 1;
  }

  signInSMS(): void {
    if (this.getSmsStep() === 1) {
      this.sendSMS();
    } else if (this.getSmsStep() === 2) {
      this.sendCode();
    }
  }

  sendSMS(): void {
    if (
      this.signInComponent &&
      this.signInComponent.smsStep < 2 &&
      this.signInComponent.smsFirstFormGroup.valid
    ) {
      const phone: string =
        this.signInComponent.smsFirstFormGroup.get('phone').value;
      if (phone) {
        this.authService
          .smsSingInFirstStep({ phone: phone })
          .subscribe((response) => {
            if (response.status === 201) {
              this.signInComponent.incrementSmsStep();
            }
          });
      }
    }
  }

  sendCode(): void {
    if (
      this.signInComponent &&
      this.signInComponent.smsStep === 2 &&
      this.signInComponent.smsFirstFormGroup.valid
    ) {
      const data: any = {
        phone: this.signInComponent.smsFirstFormGroup.get('phone').value,
        code: this.signInComponent.smsSecondFormGroup.get('code').value,
      };
      if (this.getSmsStep() === 2 && data.phone && data.code) {
        this.authService.smsSingInSecondStep(data).subscribe((response) => {
          if (response.body.success && response.headers.get('Authorization')) {
            this.login(response.body.message);
            localStorage.setItem(
              'Authorization',
              response.headers.get('Authorization')
            );
            this.cancelDialog(true);
          }
        });
      }
    }
  }

  normalSignIn(): void {
    if (this.signInComponent.nFormGroup.valid) {
      const email = this.signInComponent.nFormGroup.get('email').value;
      const password = this.signInComponent.nFormGroup.get('password').value;
      this.authService
        .authWithEmailAndPassword({ email, password })
        .subscribe((response: HttpResponse<Response<User>>) => {
          if (response.body.success && response.headers.get('Authorization')) {
            this.login(response.body.message);
            localStorage.setItem(
              'Authorization',
              response.headers.get('Authorization')
            );
            this.cancelDialog(true);
          }
        });
    }
  }

  registerStep1(): void {
    if (this.isFirstStepRegisterValid()) {
      const data = {
        firstName: this.signUpComponent.signUpFormGroup.get('firstName').value,
        lastName: this.signUpComponent.signUpFormGroup.get('lastName').value,
        email: this.signUpComponent.signUpFormGroup.get('email').value,
        password: this.signUpComponent.signUpFormGroup.get('password').value,
        phone: this.signUpComponent.signUpFormGroup.get('phone').value,
      };
      this.authService.register(data).subscribe((response) => {
        if (response.body.success) {
          this.signUpComponent.registerStep =
            this.signUpComponent.registerStep + 1;
        }
      });
    }
  }

  registerStep2(): void {
    if (this.isSecondStepRegisterValid()) {
      const data = {
        code: this.signUpComponent.signUpSecondFormGroup.get('code').value,
        phone: this.signUpComponent.signUpFormGroup.get('phone').value,
      };
      this.authService.validateRegistration(data).subscribe((response) => {
        if (response.body.success) {
          this.signUpComponent.registerStep =
            this.signUpComponent.registerStep + 1;
        }
      });
    }
  }

  onRegister(): void {
    if (this.signUpComponent.registerStep === 1) {
      this.registerStep1();
    } else {
      this.registerStep2();
    }
  }

  login(data: User): void {
    this.store.dispatch(new UpdateUser(data));
  }

  cancelDialog(isLogged): void {
    this.dialogRef.close({ isLogged: isLogged });
  }
}
