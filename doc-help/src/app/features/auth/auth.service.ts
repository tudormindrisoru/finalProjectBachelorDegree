import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public onLogin(data): void {
    console.log(data);
    if(data.email === 'test@test.com' && data.password ==='pass') {
      this.loggedIn = true;
      this.router.navigate(['/dashboard']);
    }
  }

  get isLoggedIn(): boolean {
    return this.loggedIn; 
  }
}
