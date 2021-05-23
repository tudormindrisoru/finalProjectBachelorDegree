import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOfficeDialogComponent } from './components/add-office-dialog/add-office-dialog.component';
import { JoinOfficeDialogComponent } from './components/join-office-dialog/join-office-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from './profile.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { IOffice } from 'src/app/shared/shared.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    ProfileService
  ]
})
export class ProfileComponent implements OnInit {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
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

  // _office: IOffice | undefined = undefined;
  _office : IOffice = {
    name: 'Office SRL',
    lng: 27.590000,
    lat: 47.154380,
    address: 'Strada Sfântul Lazăr 37, Iași, Romania',
    you: {
      name: 'Mindrisoru Tudor',
      photo: 'https://cdn.impakter.com/wp-content/uploads/2016/03/pexels-photo-5.jpg',
      specialty: 'Epidemiologie',
      isOfficeOwner: true,
      affiliationId: 'd1231dsad1231',
    },
    doctors: [
      {
        name: 'Mindrisoru Tudor',
        photo: 'https://cdn.impakter.com/wp-content/uploads/2016/03/pexels-photo-5.jpg',
        specialty: 'Epidemiologie',
        isOfficeOwner: true,
        affiliationId: 'd1231dsad1231'
      },
      {
        name: 'Mindrisoru George',
        photo: 'https://as2.ftcdn.net/jpg/02/60/04/09/500_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg',
        specialty: 'Genetica medicala',
        isOfficeOwner: false,
        affiliationId: 'r1231d1add41'
      },
      {
        name: 'Mindrisoru Roxana',
        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSmXOARNvvnSx2Pz2a8d2Mh5d4M87GAHQ0RkA&usqp=CAU',
        specialty: 'Nefrologie',
        isOfficeOwner: false,
        affiliationId: 'q123avca1121'
      },
      
    ]
  };
 
 
  
  importantInfoFormGroup: FormGroup;
  mainInfoFormGroup: FormGroup;
  officeDataFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    public profileService: ProfileService
    ) { }

  ngOnInit(): void {
    this.importantInfoFormGroup = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });
    this.mainInfoFormGroup = new FormGroup({
      cellPhone: new FormControl('', [ Validators.required ]),
      city: new FormControl('', [ Validators.required]),
      birthDate: new FormControl(new Date()),
      cuim: new FormControl(''),
      specialty: new FormControl('', [ Validators.required ])
    });
    if(this.office) {

    }
    this.officeDataFormGroup = new FormGroup({
      officeName: new FormControl((this.office && this.office.name) || '', [ Validators.required ]),
      officeAddress: new FormControl((this.office && this.office.address) || '', [ Validators.required ]),
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

  test() {
    console.log(this.mainInfoFormGroup.value);
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
    // const dialogRef = 
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
      data: {name: 'open office dialog' },
      disableClose: true,
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  handleAddressChange(address: Address) {
    console.log(address);
    this.officeDataFormGroup.controls['officeAddress'].setValue(address.formatted_address);
    this.officeDataFormGroup.controls['longitude'].setValue(address.geometry.location.lng());
    this.officeDataFormGroup.controls['latitude'].setValue(address.geometry.location.lat());
    // console.log(this.officeDataFormGroup.value)
}

isYou(value: Object): boolean {
  return JSON.stringify(this.office.you) === JSON.stringify(value);
}

}
