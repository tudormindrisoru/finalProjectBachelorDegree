import { Response } from './../../models/models';
import { BehaviorSubject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doctor } from '../../models/models';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
})
export class ProfileDialogComponent implements OnInit, OnDestroy {
  title: string;
  doctors: Doctor[] = null;
  selectedDoctor: Doctor = null;
  filteredOptions$: BehaviorSubject<Doctor[]> = new BehaviorSubject([]);
  // @ViewChild('codeInput') codeInput: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    public profileService: ProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
  }

  ngOnInit(): void {
    this.filteredOptions$.subscribe((element: Doctor[]) => element);
  }

  onClickOk(): any {
    let result = { success: true };

    if (this.title === 'Invite doctor' && this.selectedDoctor) {
      result['doctor'] = this.selectedDoctor;
    }
    return JSON.stringify(result);
  }

  onSearchDoctors(e): void {
    const name = e.target.value;
    if (!!name) {
      this.profileService
        .getDoctorsWithoutOffice(e.target.value)
        .subscribe((response: HttpResponse<Response<Doctor[]>>) => {
          if (response.body.success) {
            this.filteredOptions$.next(response.body.message);
            this.doctors = response.body.message;
          } else {
            this.filteredOptions$.next([]);
          }
        });
    } else {
      this.filteredOptions$.next([]);
    }
  }

  onCancel(): any {
    return { success: false };
  }

  onSubmit(): void {
    this.data.success = true;
    this.dialogRef.close();
  }

  displayDoctor(doctor: Doctor): string {
    return doctor.user.firstName + ' ' + doctor.user.lastName;
  }

  getProfileImg(src): string {
    return this.profileService.getProfileImage(src);
  }
  onSelectDoctor(doctor): void {
    this.selectedDoctor = doctor;
  }
  displayName(doc: Doctor): string {
    return doc.user.firstName + ' ' + doc.user.lastName;
  }

  onNoClick(): void {
    this.data.success = false;
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.filteredOptions$.unsubscribe();
  }
}
