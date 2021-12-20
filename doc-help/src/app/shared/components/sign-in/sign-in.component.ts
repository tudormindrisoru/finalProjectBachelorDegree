import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  @Input('signInType') typeOfSignIn: string;
  @Output('onChangeSignInType') onChangeSignInType = new EventEmitter<string>();

  smsFirstFormGroup: FormGroup;
  smsSecondFormGroup: FormGroup;
  nFormGroup: FormGroup;
  smsStep = 1;
  characterList = ["first", "second", "third", "fourth", "fifth", "sixth"];


  get firstControls(): any { return this.smsFirstFormGroup.controls; }
  get secondControls(): any { return this.smsSecondFormGroup.controls; }
  get normalControls(): any { return this.nFormGroup.controls; }

  get code(): FormControl {
    return this.smsSecondFormGroup.controls["code"] as FormControl;
  }

  get signInType(): string {
    return this.typeOfSignIn;
  }

  set signInType(newType: string) {
    this.typeOfSignIn = newType;
  }

  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.smsFirstFormGroup = this._formBuilder.group({
      phone: ['', Validators.required],
    });

    this.smsSecondFormGroup = this._formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.nFormGroup = this._formBuilder.group({
      email: ['', [ Validators.required, Validators.email]],
      password: ['', [ Validators.minLength(8), Validators.required]]
    });
  }


  getSmsStep(): number {
    return this.smsStep || 1;
  }

  // onSmsSubmit(e): void {
  //   e.preventDefault();
  //   console.log(e);
  // }

  onSignTypeChange(e: any): void {
    this.onChangeSignInType.emit(e.value);
    this.signInType = e.value;
  }

  // codeChangeFocus($event): void {
  //   console.log($event.target.attributes.id.nodeValue);
  //   switch($event.target.attributes.id.nodeValue) {
  //     case 'first': {
  //       this.onFocusInput('second');
  //       break;
  //     }
  //     case 'second': {
  //       this.onFocusInput('third');
  //       break;
  //     }
  //     case 'third': {
  //       this.onFocusInput('fourth');
  //       break;
  //     }
  //     case 'fourth': {
  //       this.onFocusInput('fifth');
  //       break;
  //     }
  //     case 'fifth': {
  //       this.onFocusInput('sixth');
  //       break;
  //     }
  //     case 'sixth': {
  //       // this.onFocusInput('sixth');
  //       break;
  //     }
  //     default: {
  //       break;
  //     }
  //   }
  // }

  getCode(): string | undefined {
    console.log(this.smsSecondFormGroup);
    if(this.smsSecondFormGroup.valid) {

    }
    return;
  }

  incrementSmsStep = () => this.smsStep++;
  decrementSmsStep = () => this.smsStep--;

}
