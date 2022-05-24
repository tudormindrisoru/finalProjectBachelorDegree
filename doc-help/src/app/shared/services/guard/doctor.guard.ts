import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DoctorGuard implements CanLoad {
  constructor(
    public authService: AuthService,
    public router: Router,
    private store: Store
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    let isDoctor = false;
    this.store
      .select((state) => state.user)
      .pipe(take(1))
      .subscribe((user) => {
        console.log(user);
        if (!user) {
          this.router.navigate(['/sign-in']);
        } else {
          if (!!user.doctorId) {
            isDoctor = true;
          }
        }
      });
    return isDoctor;
  }
}
