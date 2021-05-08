import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from './auth.service';

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
  registerForm: FormGroup;
  sliderLeft: string = '0%';
  mobileView: boolean = window.innerWidth > 768 ? false : true;
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.mobileView = event.target.innerWidth > 768 ? false : true;
 }
  
  constructor(
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    
    this.initLoginForm();
    this.initRegisterForm();
  }

  protected initLoginForm(): void {
    
    this.loginForm = new FormGroup({
      email: new FormControl('',[ Validators.required, Validators.email ]),
      password: new FormControl('', [ Validators.required]) 
    });
  }

  protected initRegisterForm(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('',[ Validators.required, Validators.email ]),
      password: new FormControl('', [ Validators.required]), 
      secondPassword: new FormControl('', [ Validators.required]) 
    });
  }

  public onLoginSubmit(): void {
    this.authService.onLogin(this.loginForm.value);
  }

  public signSlide(): void {
    if(this.sliderLeft === '0%') {
      this.sliderLeft = '50%';
    } else {
      this.sliderLeft = '0%';
    }
    this.resetForms();
  }

  private resetForms(): void {
    this.loginForm.reset();
    this.registerForm.reset();
  }
}
