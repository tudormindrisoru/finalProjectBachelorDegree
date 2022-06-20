import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    private store: Store
  ) {}

  // canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //   let isAuthenticated = false;
  //   this.store.select(state => state.user).pipe(take(1)).subscribe( user => {
  //     console.log(user);
  //     if(!user) {
  //       this.router.navigate(['/sign-in']);
  //     } else {
  //       isAuthenticated = true;
  //     }
  //   });
  //   console.log("canLoad ",isAuthenticated);
  //   return isAuthenticated;
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authToken = localStorage.getItem('Authorization');
    if (!!authToken) {
      return true;
    }
    return false;
  }
}
