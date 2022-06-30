import { UpdateDoctorInfo } from 'src/app/store/actions/doctor.actions';
import { DoctorState } from './../../store/state/doctor.state';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { first } from 'rxjs/operators';
import { Doctor, Office, Response, User } from 'src/app/shared/models/models';
import { UpdateUser } from 'src/app/store/actions/user.actions';
import { Observable } from 'rxjs';
import { OfficeState } from 'src/app/store/state/office.state';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  user: User;
  @Select(DoctorState) doctor$: Observable<Doctor>;
  @Select(OfficeState) office$: Observable<Office>;
  private initialSnapshot: any;

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.store
      .select((state) => state.user)
      .pipe(first())
      .subscribe((user) => (this.user = user));

    if (!this.user) {
      if (!localStorage.getItem('Authorization')) {
        this.router.navigate(['/']);
        this.resetStore();
      } else {
        this.authService
          .getUser()
          .subscribe((response: HttpResponse<Response<User>>) => {
            if (response.body.success) {
              this.store.dispatch(new UpdateUser(response.body.message));
              if (response.body.message.docId) {
                this.profileService
                  .getDoctorInfo()
                  .subscribe((response: HttpResponse<Response<Doctor>>) => {
                    if (response.body.success) {
                      this.store.dispatch(
                        new UpdateDoctorInfo(response.body.message)
                      );
                    }
                  });
              }
            }
          });
      }
    }
  }

  ngOnInit(): void {}

  onToggleClick(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  goToMainPage(): void {
    this.router.navigate(['/']);
  }

  resetStore(): void {
    this.store.reset(this.initialSnapshot);
  }
}
