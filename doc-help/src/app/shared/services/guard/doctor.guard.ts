import { OfficeState } from './../../../store/state/office.state';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Office } from '../../models/models';

@Injectable()
export class DoctorGuard implements CanLoad, CanActivate {
  office: Office;
  constructor(
    public authService: AuthService,
    public router: Router,
    private store: Store
  ) {
    this.store
      .select((state) => state.office)
      .subscribe((res) => (this.office = res));
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    console.log('------------------------');

    return !!this.office;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('------------------------ 2');
    return !!this.office;
  }
}
