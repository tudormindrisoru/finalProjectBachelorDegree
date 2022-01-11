import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { Doctor, User, Response, Office } from 'src/app/shared/models/models';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UpdateDoctorInfo } from 'src/app/store/actions/doctor.actions';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { UpdateOfficeInfo, RemoveOfficeInfo } from 'src/app/store/actions/office.actions';
import { UpdateUser } from 'src/app/store/actions/user.actions';
import { ProfileDialogComponent } from 'src/app/shared/components/profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('autocompleteRef') autocompleteRef: GooglePlaceDirective;

  options = {
    types: ['address'],
    componentRestrictions: { country: 'RO' },
    fields: ['address_components', 'geometry', 'formatted_address'],
    region: 'RO',
    language: 'ro',
  };

  profileImage: string | ArrayBuffer;
  specialties = [
    'Alergologie',
    'Balneofizioterapie',
    'Cardiologie',
    'Dermatologie',
    'Endocrinologie',
    'Epidemiologie',
    'Gastroenterologie',
    'Genetica medicala',
    'Hematologie',
    'Hepatologie',
    'Nefrologie',
    'Neonatologie',
    'Neurochirurgie',
    'Neurologie',
    'Ginecologie',
    'Oftalmologie',
    'Oncologie',
    'Ortopedie',
    'Patologie',
    'Pediatrie',
    'Psihiatrie',
    'Reumatologie',
    'Stomatologie',
    'Urologie',
  ];

  user: User;
  doctor: Doctor;
  office: Office;
  userFormGroup: FormGroup;
  doctorFormGroup: FormGroup;
  officeFormGroup: FormGroup;

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
    private router: Router
  ) {}

  async ngOnInit() {
    this.store
      .select((state) => state.user)
      .pipe(first())
      .subscribe((user) => (this.user = user));
    this.store
      .select((state) => state.doctor)
      .pipe(first())
      .subscribe((doctor) => (this.doctor = doctor));
    this.store
      .select((state) => state.office)
      .pipe(first())
      .subscribe((office) => (this.office = office));
    // this.profileImage = this.profileService.getProfileImage(this.user.photo);

    if (!this.user) {
      this.router.navigate(['/']);
    }

    this.userFormGroup = new FormGroup({
      firstName: new FormControl(this.user ? this.user.firstName : '', [
        Validators.required,
      ]),
      lastName: new FormControl(this.user ? this.user.lastName : '', [
        Validators.required,
      ]),
      phone: new FormControl(this.user ? this.user.phone : '', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });

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
      address: new FormControl((this.office && this.office.address) || '', [
        Validators.required,
      ]),
      name: new FormControl((this.office && this.office.oName) || '', [
        Validators.required,
      ]),
      longitude: new FormControl((this.office && this.office.longitude) || '', [
        Validators.required,
      ]),
      latitude: new FormControl((this.office && this.office.latitude) || '', [
        Validators.required,
      ]),
      doctors: new FormArray([]),
    });

    if (!!this.user.docId) {
      this.store
        .select((state) => state.doctor)
        .pipe(first())
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
                  console.log(this.office);
                  this.store.dispatch(new UpdateOfficeInfo(this.office));
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
        (this.doctorControls.cuim.value !== this.doctor.cuim ||
          this.doctorControls.specialty.value !== this.doctor.specialty) &&
        this.doctorFormGroup.valid
      ) {
        return false;
      }
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
    }
  }

  handleAddressChange(address: Address): void {
    const route = address.address_components.find(
      (res) => res.types.findIndex((res2) => res2 === 'route') !== -1
    );
    const streetNumber = address.address_components.find(
      (res) => res.types.findIndex((res2) => res2 === 'street_number') !== -1
    );
    const locality = address.address_components.find(
      (res) => res.types.findIndex((res2) => res2 === 'locality') !== -1
    );
    const country = address.address_components.find(
      (res) => res.types.findIndex((res2) => res2 === 'country') !== -1
    );

    const newAdrress =
      (route ? route.long_name + ' ' : '') +
      (streetNumber ? streetNumber.long_name + ' ' : '') +
      (locality ? locality.long_name + ' ' : '') +
      (country ? country.long_name + ' ' : '');
    this.officeFormGroup.controls.address.setValue(newAdrress);
    this.officeFormGroup.controls.longitude.setValue(
      address.geometry.location.lng()
    );
    this.officeFormGroup.controls.latitude.setValue(
      address.geometry.location.lat()
    );
    console.log(address);
  }
  
  saveUser(): void {
    if (this.userFormGroup.valid) {
      let user: User = {
        'firstName': this.userControls.firstName.value,
        'lastName': this.userControls.lastName.value,
        'phone': this.userControls.phone.value
      };

      this.profileService.saveUser(user).subscribe((response: HttpResponse<Response<User>>) => {
        if(response.body.success || response.ok) {
          this.user.firstName = this.userControls.firstName.value;
          this.user.lastName = this.userControls.lastName.value;
          this.user.phone = this.userControls.phone.value;
          this.store.dispatch(new UpdateUser(this.user));
        }
      });
    }
  }

  saveDoctor(): void {
    if (this.doctorFormGroup.valid) {
      let doctor: Doctor = {
        'cuim': this.doctorControls.cuim.value,
        'specialty': this.doctorControls.specialty.value
      }
      this.profileService.saveDoctor(doctor).subscribe( (response: HttpResponse<Response<Doctor>>) => {
        if(response.body.success || response.ok) {
          this.doctor.cuim = doctor.cuim;
          this.doctor.specialty = doctor.specialty;
          console.log(this.doctor);
          this.store.dispatch(new UpdateDoctorInfo(this.doctor));
        }
      });
    }
  }

  addOffice(): void {
    if(this.officeFormGroup.valid) {
      let office: Office = {
        'address': this.officeControls.address.value,
        'oName': this.officeControls.name.value,
        'latitude': this.officeControls.latitude.value,
        'longitude': this.officeControls.longitude.value
      };

      if(!this.office) {
        this.profileService.addOffice(office).subscribe( (response: HttpResponse<Response<Office>>) => {
          if(response.body.success || response.ok) {
            this.office = response.body.message;
            this.store.dispatch(new UpdateOfficeInfo(this.office));
          }
        });
      } else {
        this.profileService.updateOffice(office).subscribe(((response: HttpResponse<Response<any>>) => {
          if(response.body.success || response.ok) {
            this.office.address = office.address;
            this.office.oName = office.oName;
            this.office.latitude = office.latitude;
            this.office.longitude = office.longitude;
            console.log(this.office);
            this.store.dispatch(new UpdateOfficeInfo(this.office));
          }
        }));
      }
    }
  }

  updateOffice(): void {

  }

  removeOffice(): void {
    if (this.office.id) {
      this.profileService.removeOffice().subscribe( (response: HttpResponse<Response<any>>) => {
        if(response.body.success || response.ok) {
          this.office = null;
          this.officeFormGroup.controls.name.setValue('');
          this.officeFormGroup.controls.address.setValue('');
          this.officeFormGroup.controls.latitude.setValue('');
          this.officeFormGroup.controls.longitude.setValue('');
          this.store.dispatch(new RemoveOfficeInfo());
        }
      });
    }
  }

  openDialog(title: string): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '250px',
      data: { title },
    });

    dialogRef.afterClosed().subscribe(success => {
      console.log('The dialog was closed', success, typeof success);
      if (success === 'true') {
        console.log(title);
        if (title === 'Save user') {
          this.saveUser();
        }
        if (title === 'Save doctor') {
          this.saveDoctor();
        }

        if(title === 'Invite doctor') {
          
        }

        if(title === 'Remove doctor') {

        }

        if(title === 'Remove office') {
          this.removeOffice();
        }
      }
    });
  }


  // isYou(doctorIndex: number): boolean {
  //   return JSON.stringify(this.office.you) === JSON.stringify(this.office.doctors[doctorIndex]);
  // }
}
