import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import {
  Doctor,
  User,
  Response,
  Office,
  SearchResult,
} from 'src/app/shared/models/models';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UpdateDoctorInfo } from 'src/app/store/actions/doctor.actions';
import {
  UpdateOfficeInfo,
  RemoveOfficeInfo,
} from 'src/app/store/actions/office.actions';
import { UpdateUser } from 'src/app/store/actions/user.actions';
import { ProfileDialogComponent } from 'src/app/shared/components/profile-dialog/profile-dialog.component';
import { specialtyList } from 'src/app/shared/constants/constants';
import { MapComponent } from 'src/app/shared/components/map/map.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileImage: string | ArrayBuffer;
  specialties = specialtyList;

  user: User;
  doctor: Doctor;
  office: Office;
  userFormGroup: FormGroup;
  doctorFormGroup: FormGroup;
  officeFormGroup: FormGroup;
  addressOptions: SearchResult[] = [];
  isLoading: boolean;

  @ViewChild('map') map: MapComponent;

  get userControls(): any {
    return this.userFormGroup.controls;
  }
  get doctorControls(): any {
    return this.doctorFormGroup.controls;
  }
  get officeControls(): any {
    return this.officeFormGroup.controls;
  }
  get isOfficeAdded(): boolean {
    return !!this.office;
  }

  constructor(
    public dialog: MatDialog,
    public profileService: ProfileService,
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoading = true;
  }

  get loading(): boolean {
    return this.isLoading;
  }

  async ngOnInit() {
    this.store
      .select((state) => state.user)
      .subscribe((user) => (this.user = user));
    this.store
      .select((state) => state.doctor)
      .subscribe((doctor) => (this.doctor = doctor));
    this.store
      .select((state) => state.office)
      .subscribe((office) => {
        this.office = office;
        if (this.officeFormGroup) {
          this.officeFormGroup.controls.id.setValue(this.office.id);
          this.officeFormGroup.controls.name.setValue(this.office.oName);
          this.officeFormGroup.controls.address.setValue(this.office.address);
          this.officeFormGroup.controls.latitude.setValue(this.office.latitude);
          this.officeFormGroup.controls.longitude.setValue(
            this.office.longitude
          );
        }
      });

    if (!this.user) {
      if (!localStorage.getItem('Authorization')) {
        this.router.navigate(['/']);
      } else {
        this.authService
          .getUser()
          .subscribe((response: HttpResponse<Response<User>>) => {
            if (response.body.success) {
              this.user = response.body.message;
              this.initProfile();
            }
          });
      }
    } else {
      this.initProfile();
    }
  }

  initProfile() {
    this.userFormGroup = new FormGroup({
      firstName: new FormControl(this.user ? this.user.firstName : '', [
        Validators.required,
      ]),
      lastName: new FormControl(this.user ? this.user.lastName : '', [
        Validators.required,
      ]),
      phone: new FormControl(
        { value: this.user ? this.user.phone : '', disabled: true },
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]
      ),
    });
    this.isLoading = false;

    this.doctorFormGroup = new FormGroup({
      cuim: new FormControl(
        this.doctor && this.doctor.cuim ? this.doctor.cuim : '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]
      ),
      specialty: new FormControl(
        this.doctor && this.doctor.specialty ? this.doctor.specialty : '',
        [Validators.required]
      ),
    });

    this.officeFormGroup = new FormGroup({
      id: new FormControl((this.office && this.office.id) || undefined),
      address: new FormControl((this.office && this.office.address) || '', [
        Validators.required,
      ]),
      name: new FormControl((this.office && this.office.oName) || '', [
        Validators.required,
      ]),
      longitude: new FormControl(this.office?.longitude || undefined, [
        Validators.required,
      ]),
      latitude: new FormControl(this.office?.latitude || undefined, [
        Validators.required,
      ]),
      city: new FormControl((this.office && this.office.city) || '', [
        Validators.required,
      ]),
      doctors: new FormArray([]),
    });
    if (!!this.user?.docId) {
      this.store
        .select((state) => state.doctor)
        .subscribe((doc) => (this.doctor = doc));
      if (!this.doctor) {
        this.profileService
          .getDoctorInfo()
          .subscribe((response: HttpResponse<Response<Doctor>>) => {
            this.doctor = response.body.message;
            this.store.dispatch(new UpdateDoctorInfo(this.doctor));
            if (this.doctor.cuim) {
              this.doctorFormGroup.controls.cuim.setValue(this.doctor.cuim);
            }
            if (this.doctor.specialty) {
              this.doctorFormGroup.controls.specialty.setValue(
                this.doctor.specialty
              );
            }
            if (
              this.doctor &&
              this.doctor.officeId &&
              !isNaN(this.doctor.officeId)
            ) {
              this.profileService
                .getOffice(this.doctor.officeId)
                .subscribe((response: HttpResponse<Response<Office>>) => {
                  this.office = response.body.message;

                  this.store.dispatch(new UpdateOfficeInfo(this.office));
                  this.officeFormGroup.controls.id.setValue(this.office.id);
                  this.officeFormGroup.controls.name.setValue(
                    this.office.oName
                  );
                  this.officeFormGroup.controls.address.setValue(
                    this.office.address
                  );
                  this.officeFormGroup.controls.latitude.setValue(
                    this.office.latitude
                  );
                  this.officeFormGroup.controls.longitude.setValue(
                    this.office.longitude
                  );
                });
            }
          });
      }
    }
  }

  onAddressSearch($event) {
    if (this.map) {
      if ($event.target.value.length === 0) {
        this.addressOptions = [];
        return;
      }
      this.map.addressSearch($event.target.value);
    }
  }

  getProfileImg(src): string {
    return this.profileService.getProfileImage(src);
  }

  get areOfficeFieldsDisabled(): boolean {
    return false;
  }

  get isOfficeInfoValid(): boolean {
    return this.officeFormGroup.valid || false;
  }

  get ownerCheck(): boolean {
    if (this.office && this.office.administratorId) {
      if (this.office.administratorId === this.doctor.id) {
        return true;
      }
    }
    return false;
  }

  get isUserSaveButtonDisabled(): boolean {
    if (
      (this.userControls.firstName.value !== this.user.firstName ||
        this.userControls.lastName.value !== this.user.lastName ||
        this.userControls.phone.value !== this.user.phone) &&
      this.userFormGroup.valid
    ) {
      return false;
    }
    return true;
  }

  get isDoctorInfoSaveButtonDisabled(): boolean {
    if (this.doctor) {
      if (
        (this.doctorControls?.cuim?.value !== this.doctor?.cuim ||
          this.doctorControls?.specialty?.value !== this.doctor?.specialty) &&
        this.doctorFormGroup.valid
      ) {
        return false;
      }
    }

    if (!this.doctor && this.doctorFormGroup.valid) {
      return false;
    }
    return true;
  }

  get isSaveOfficeButtonDisabled(): boolean {
    if (this.office) {
      if (
        (this.officeControls.address.value !== this.office.address ||
          this.officeControls.name.value !== this.office.oName ||
          this.officeControls.longitude.value !== this.office.longitude ||
          this.officeControls.latitude.value !== this.office.latitude) &&
        this.officeFormGroup.valid
      ) {
        return false;
      }
    }
    return this.officeFormGroup.valid;
  }

  onPhotoChange(imageInput): void {
    imageInput.click();
  }

  selectPhoto(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.profileImage = reader.result);
      reader.readAsDataURL(file);
      this.profileService
        .updatePhoto(file)
        .subscribe((response: HttpResponse<Response<any>>) => {
          if (response.body.success) {
            let userCopy = JSON.parse(JSON.stringify(this.user));
            let officeCopy = JSON.parse(JSON.stringify(this.office));
            userCopy.photo = response.body.message.photo;
            this.store.dispatch(new UpdateUser(userCopy));
            if (officeCopy) {
              const doctorIndex = officeCopy?.doctors?.findIndex(
                (doc) => doc.id === userCopy?.docId
              );
              if (
                doctorIndex !== -1 &&
                officeCopy &&
                officeCopy.doctors.length > 0
              ) {
                officeCopy.doctors[doctorIndex].user.photo = userCopy.photo;

                this.store.dispatch(new UpdateOfficeInfo(officeCopy));
              }
            }
          }
        });
    }
  }

  saveUser(): void {
    if (this.userFormGroup.valid) {
      let user: User = {
        firstName: this.userControls.firstName.value,
        lastName: this.userControls.lastName.value,
        phone: this.userControls.phone.value,
      };

      this.profileService
        .saveUser(user)
        .subscribe((response: HttpResponse<Response<User>>) => {
          if (response.body.success || response.ok) {
            let userCopy = JSON.parse(JSON.stringify(this.user));

            userCopy.firstName = this.userControls.firstName.value;
            userCopy.lastName = this.userControls.lastName.value;
            userCopy.phone = this.userControls.phone.value;
            this.store.dispatch(new UpdateUser(userCopy));
          }
        });
    }
  }
  saveDoctor(): void {
    if (this.doctor) {
      this.updateDoctor();
    } else {
      this.addDoctor();
    }
  }

  updateDoctor(): void {
    if (this.doctorFormGroup.valid) {
      let doctor: Doctor = {
        cuim: this.doctorControls.cuim.value,
        specialty: this.doctorControls.specialty.value,
      };
      this.profileService
        .updateDoctor(doctor)
        .subscribe((response: HttpResponse<Response<Doctor>>) => {
          if (response.body.success || response.ok) {
            this.doctor.cuim = doctor.cuim;
            this.doctor.specialty = doctor.specialty;

            this.store.dispatch(new UpdateDoctorInfo(this.doctor));
          }
        });
    }
  }

  addDoctor(): void {
    if (this.doctorFormGroup.valid) {
      let doctor: Doctor = {
        cuim: this.doctorControls.cuim.value,
        specialty: this.doctorControls.specialty.value,
      };
      this.profileService
        .addDoctor(doctor)
        .subscribe((response: HttpResponse<Response<Doctor>>) => {
          if (response.body.success || response.ok) {
            this.store.dispatch(new UpdateDoctorInfo(response.body.message));
          }
        });
    }
  }

  addOffice(): void {
    if (this.officeFormGroup.valid) {
      let office: Office = {
        address: this.officeControls.address.value,
        oName: this.officeControls.name.value,
        latitude: this.officeControls.latitude.value,
        longitude: this.officeControls.longitude.value,
        city: this.officeControls.city.value,
      };

      if (!this.office?.id) {
        this.profileService
          .addOffice(office)
          .subscribe((response: HttpResponse<Response<Office>>) => {
            if (response.body.success) {
              this.office = response.body.message;
              this.office.doctors = [
                {
                  id: this.doctor.id,
                  user: {
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    photo: this.user.photo,
                  },
                },
              ];
              this.store.dispatch(new UpdateOfficeInfo(this.office));
            }
          });
      } else {
        this.updateOffice(office);
      }
    }
  }

  inviteDoctor(doctor): void {
    if (doctor.id && this.office.id) {
      const data = { doctorId: doctor.id, officeId: this.office.id };

      this.profileService
        .inviteDoctor(data)
        .subscribe((response: HttpResponse<Response<any>>) => {
          if (!!response.body && response.body.success) {
          }
        });
    }
  }

  updateOffice(office): void {
    this.profileService
      .updateOffice(office)
      .subscribe((response: HttpResponse<Response<any>>) => {
        if (response.body.success || response.ok) {
          this.office.address = office.address;
          this.office.oName = office.oName;
          this.office.latitude = office.latitude;
          this.office.longitude = office.longitude;
          this.office.city = office.city;

          this.store.dispatch(new UpdateOfficeInfo(this.office));
        }
      });
  }

  removeOffice(): void {
    if (this.office.id) {
      this.profileService
        .removeOffice()
        .subscribe((response: HttpResponse<Response<any>>) => {
          if (response.body.success || response.ok) {
            this.officeFormGroup.controls.name.setValue('');
            this.officeFormGroup.controls.address.setValue('');
            this.officeFormGroup.controls.latitude.setValue('');
            this.officeFormGroup.controls.longitude.setValue('');
            this.store.dispatch(new UpdateOfficeInfo(null));
            this.map.clearMarkers();
          }
        });
    }
  }

  openDialog(title: string): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '250px',
      data: { title },
    });

    dialogRef.afterClosed().subscribe((data) => {
      data = JSON.parse(data);

      if (data.success) {
        if (title === 'Save user') {
          this.saveUser();
        }
        if (title === 'Salveaza doctor') {
          this.saveDoctor();
        }

        if (title === 'Invita doctor') {
          if (!!data.doctor) {
            this.inviteDoctor(data.doctor);
          }
        }

        if (title === 'Remove doctor') {
        }

        if (title === 'Remove office') {
          this.removeOffice();
        }
      }
    });
  }

  getAddressOptions($event: SearchResult[]) {
    this.addressOptions = $event;
  }

  onAddressSelect(result: SearchResult): void {
    if (!this.office) {
      this.office = {} as Office;
    }
    this.officeFormGroup.controls['address'].setValue(result.address);
    this.officeFormGroup.controls['city'].setValue(result.county);
    this.officeFormGroup.controls['longitude'].setValue(result.lng);
    this.officeFormGroup.controls['latitude'].setValue(result.lat);
    this.office.longitude = result.lng;
    this.office.latitude = result.lat;
    this.office.city = result.county;
  }
}
