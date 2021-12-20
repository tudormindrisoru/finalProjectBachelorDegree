import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOfficeDialogComponent } from './components/add-office-dialog/add-office-dialog.component';
import { JoinOfficeDialogComponent } from './components/join-office-dialog/join-office-dialog.component';

import { MatDialog } from '@angular/material/dialog';
// import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { IOffice } from 'src/app/shared/shared.model';
import { DoctorDetailDialogComponent } from './components/doctor-detail-dialog/doctor-detail-dialog.component';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { Doctor, User, Response } from 'src/app/shared/models/models';
import { first, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  autocompleteOptions = {
    types: [ "address" ],
    componentRestrictions: { country: 'RO' },
    fields: ["address_components" ,"geometry", "formatted_address" ],
    region: 'RO',
    language: 'ro'
  }
  profileImage: string | ArrayBuffer = '../../../assets/user.png';
  specialties = ['Alergologie', 'Balneofizioterapie','Cardiologie','Dermatologie','Endocrinologie','Epidemiologie','Gastroenterologie','Genetica medicala','Hematologie','Hepatologie','Nefrologie','Neonatologie','Neurochirurgie','Neurologie','Ginecologie','Oftalmologie','Oncologie','Ortopedie','Patologie','Pediatrie','Psihiatrie','Reumatologie','Stomatologie','Urologie'];
  cities: string[] = ['Bacau','Iasi','Bucuresti'];

  _office: IOffice | undefined = undefined;
  // _office : IOffice = {
  //   name: 'Office SRL',
  //   lng: 27.590000,
  //   lat: 47.154380,
  //   address: 'Strada Sfântul Lazăr 37, Iași, Romania',
  //   you: {
  //     name: 'Mindrisoru Tudor',
  //     photo: 'https://cdn.impakter.com/wp-content/uploads/2016/03/pexels-photo-5.jpg',
  //     specialty: 'Epidemiologie',
  //     birthDate: new Date('02/24/1998'),
  //     phone: '0742748699',
  //     isOfficeOwner: true,
  //     affiliationId: 'd1231dsad1231',
  //   },
  //   doctors: [
  //     {
  //       name: 'Mindrisoru Tudor',
  //       photo: 'https://cdn.impakter.com/wp-content/uploads/2016/03/pexels-photo-5.jpg',
  //       specialty: 'Epidemiologie',
  //       birthDate: new Date('02/24/1998'),
  //       phone: '0742748699',
  //       isOfficeOwner: true,
  //       affiliationId: 'd1231dsad1231'
  //     },
  //     {
  //       name: 'Mindrisoru George',
  //       photo: 'https://as2.ftcdn.net/jpg/02/60/04/09/500_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg',
  //       specialty: 'Genetica medicala',
  //       birthDate: new Date('10/08/1989'),
  //       phone: '0742123123',
  //       isOfficeOwner: false,
  //       affiliationId: 'r1231d1add41'
  //     },
  //     {
  //       name: 'Mindrisoru Roxana',
  //       photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSmXOARNvvnSx2Pz2a8d2Mh5d4M87GAHQ0RkA&usqp=CAU',
  //       specialty: 'Nefrologie',
  //       birthDate: new Date('02/07/1989'),
  //       phone: '0740321321',
  //       isOfficeOwner: false,
  //       affiliationId: 'q123avca1121'
  //     },
      
  //   ]
  // };
 
 
  user: User;
  doctor: Doctor;
  userFormGroup: FormGroup;
  doctorFormGroup: FormGroup;
  officeDataFormGroup: FormGroup;
  
  constructor(
    public dialog: MatDialog,
    public profileService: ProfileService,
    private store: Store,
    private router: Router
    ) {
      this.store.select(state => state.user).pipe(first()).subscribe( user => this.user = user);
      if (!this.user) {
        this.router.navigate(['/']);
      }
      if(!!this.user.docId) {
        this.store.select( state => state.doctor).pipe(first()).subscribe( doc => this.doctor = doc);
        if(!this.doctor) {
          this.profileService.getDoctorInfo().subscribe(
            (response: HttpResponse<Response<Doctor>>) => this.doctor = response.body.message
          );
        }
      }
    }

  ngOnInit(): void {
    this.userFormGroup = new FormGroup({
      firstName: new FormControl(this.user ? this.user.firstName : '', [ Validators.required ]),
      lastName: new FormControl(this.user ? this.user.lastName : '', [ Validators.required ]),
      phone: new FormControl(this.user ? this.user.phone : '', [ Validators.required, Validators.minLength(10)])
    });

    this.doctorFormGroup = new FormGroup({
      cuim: new FormControl(''),
      specialty: new FormControl('', [ Validators.required ])
    });

    this.officeDataFormGroup = new FormGroup({
      name: new FormControl((this.office && this.office.name) || '', [ Validators.required ]),
      longitude: new FormControl((this.office && this.office.lng) || '', [ Validators.required ]),
      latitude: new FormControl((this.office && this.office.lat) || '', [ Validators.required ]),
      doctors: new FormArray([]),
    });

    this.initDoctorsFormGroups();
  }

  get office(): IOffice | undefined {
    return this._office || undefined;
  }

  set office(newOffice) {
    this._office = newOffice;
  }

  get userInfo(): User {
    return this.user || null; 
  }

  get isDoctorInfoValid(): boolean {
    return this.doctorFormGroup.valid || false;
  }

  onPhotoChange(imageInput) {
    imageInput.click();
    
  }

  initDoctorsFormGroups() {
    let doctors = this.officeDataFormGroup.get('doctors') as FormArray;
    if( this.office !== {} && this.office && this.office.doctors !== []) {
      this.office.doctors.forEach((doctor) => {
        let doctorFormGroup = new FormGroup({
          name: new FormControl(doctor.name),
          photo: new FormControl(doctor.photo),
          specialty: new FormControl(doctor.specialty),
          birthDate: new FormControl(doctor.birthDate),
          phone: new FormControl(doctor.phone),
          isOfficeOwner: new FormControl(doctor.isOfficeOwner),
          affiliationId: new FormControl(doctor.affiliationId)
        });
        doctors.push(doctorFormGroup);
      });
   }
  //  console.log(this.officeDataFormGroup.value);
  }

  selectPhoto(event: any): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => this.profileImage = reader.result;
        reader.readAsDataURL(file);
    }
  }

  onOpenAddOfficeDialog(): void {
    this.dialog.open(AddOfficeDialogComponent, {
      width: '400px',
      data: {name: 'Add office dialog'},
      disableClose: true,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  onOpenJoinOfficeDialog(): void {
    // const dialogRef = 
    this.dialog.open(JoinOfficeDialogComponent, {
      width: '400px',
      data: { name: 'Join Office Dialog'},
      disableClose: true,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  onOpenDoctorDetailDialog(doctorIndex: number): void {
    if(!this.isYou(doctorIndex)) {
      let selectedDoctor: FormGroup;
      if(doctorIndex) {
        const doctors = this.officeDataFormGroup.get('doctors') as FormArray;
        selectedDoctor = doctors.at(doctorIndex) as FormGroup;
      }
      // const dialogRef = 
      this.dialog.open(DoctorDetailDialogComponent, {
        width: "500",
        data: doctorIndex && selectedDoctor ? {
          canModify: this.office.you.isOfficeOwner,
          doctorInfo: {
            name: selectedDoctor.controls.name.value,
            photo: selectedDoctor.controls.photo.value,
            specialty: selectedDoctor.controls.specialty.value,
            birthDate: selectedDoctor.controls.birthDate.value,
            phone: selectedDoctor.controls.phone.value,
            isOfficeOwner: selectedDoctor.controls.isOfficeOwner.value,
            affiliationId: selectedDoctor.controls.affiliationId.value
          },
        }: undefined,
        disableClose: true,
      });
  
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      // });
    }
  }

//   handleAddressChange() {
//     // console.log(address);
//     this.officeDataFormGroup.controls['officeAddress'].setValue(address.formatted_address);
//     this.officeDataFormGroup.controls['longitude'].setValue(address.geometry.location.lng());
//     this.officeDataFormGroup.controls['latitude'].setValue(address.geometry.location.lat());
//     // console.log(this.officeDataFormGroup.value)
// }

isYou(doctorIndex: number): boolean {
  return JSON.stringify(this.office.you) === JSON.stringify(this.office.doctors[doctorIndex]);
}

}
