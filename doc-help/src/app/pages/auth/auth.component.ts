import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { GdprRegisterConsentDialogComponent } from 'src/app/shared/components/gdpr-register-consent-dialog/gdpr-register-consent-dialog.component';
import { AuthService } from './auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
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
  matcher = new MyErrorStateMatcher();
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.mobileView = event.target.innerWidth > 768 ? false : true;
  }
  
  constructor(
    public authService: AuthService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    
    this.initLoginForm();
    this.initRegisterForm();
  }

  protected initLoginForm(): void {
    
    this.loginForm = new FormGroup({
        email: new FormControl('',[ Validators.required, Validators.email , Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('', [ Validators.required, Validators.minLength(6)]) 
      });
  }
  get logF() {
    return this.loginForm.controls;
  }

  protected initRegisterForm(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('',[ Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [ Validators.required, Validators.minLength(6)]), 
      confirmPassword: new FormControl('', [ Validators.required]) 
    }, this.checkPasswords);
  }

  get regF() {
    return this.registerForm.controls;
  }

  checkPasswords(fg: FormGroup) {
    const password = fg.get('password').value;
    const confirmPassword = fg.get('confirmPassword').value;
  
    return (password === confirmPassword) ? null : { notSame: true }     
  }

  static isValidMailFormat(control: FormControl){
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
        return { "Please provide a valid email": true };
    }

    return null;
  }


  public onLoginSubmit(): void {
    this.authService.onLogin(this.loginForm.value);
  }

  onGDPRConsentDialog(): void {
    const dialogRef = this.dialog.open(GdprRegisterConsentDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((isApproved: boolean) => {
      if(isApproved) {
        this.onRegisterSubmit();
      } else { 
        console.log('The dialog closed without approval');
      }
    });
  }

  public onRegisterSubmit(): void {
    this.authService.onRegister(this.registerForm.value);
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
