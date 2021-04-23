import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;
  sliderLeft: string = '0%';
  mobileView: boolean = window.innerWidth > 768 ? false : true;

  constructor(
    private _fb: FormBuilder
    ) { }

  ngOnInit(): void {
    console.log('width',window.innerWidth);
    
    console.log('mobileView:',this.mobileView);
    console.log('sliderLeft:',this.sliderLeft);
    
    this.initForm();
  }

  protected initForm(): void {
    this.loginForm = this._fb.group({
      email: new FormControl('', [ Validators.required, Validators.email ]),
      password: new FormControl('', [ Validators.required]) 
    });
  }

  public onLoginSubmit(): void {
    console.log(this.loginForm);
  }

  public signSlide(): void {
    if(this.sliderLeft === '0%') {
      this.sliderLeft = '50%';
    } else {
      this.sliderLeft = '0%';
    }

    // if(this.mobileView) {

    // }
  }
}
