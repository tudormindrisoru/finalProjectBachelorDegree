import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOfficeDialogComponent } from './components/add-office-dialog/add-office-dialog.component';
import { JoinOfficeDialogComponent } from './components/join-office-dialog/join-office-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    ProfileService
  ]
})
export class ProfileComponent implements OnInit {

  profileImage: string | ArrayBuffer = '../../../assets/user.png';
  specialties = ['Alergologie', 'Balneofizioterapie','Cardiologie','Dermatologie','Endocrinologie','Epidemiologie','Gastroenterologie','Genetica medicala','Hematologie','Hepatologie','Nefrologie','Neonatologie','Neurochirurgie','Neurologie','Ginecologie','Oftalmologie','Oncologie','Ortopedie','Patologie','Pediatrie','Psihiatrie','Reumatologie','Stomatologie','Urologie'];
  _office: Object;
  // = {
  //   name: 'Office SRL',
  //   address: 'Sfantul Lazar 37 bloc B5',
    
  //   doctors: [
  //     {
  //       name: 'Mindrisoru Tudor',
  //       photo: 'https://cdn.impakter.com/wp-content/uploads/2016/03/pexels-photo-5.jpg',
  //       isOwner: true,
  //     },
  //     {
  //       name: 'Mindrisoru George',
  //       photo: 'https://as2.ftcdn.net/jpg/02/60/04/09/500_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg'
  //     },
  //     {
  //       name: 'Mindrisoru Roxana',
  //       photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSmXOARNvvnSx2Pz2a8d2Mh5d4M87GAHQ0RkA&usqp=CAU'
  //     }
  //   ]
  // }

  lat = 51.678418;
  lng = 7.809007;

  userType: string[] = ['patient', 'doctor'];
  cities: string[] = ['Bacau','Iasi','Bucuresti'];
  
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
    this.officeDataFormGroup = new FormGroup({
      officeName: new FormControl('', [ Validators.required ]),
      officeAddress: new FormControl('', [ Validators.required ]),
    });
   
  }

  get office(): Object {
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
      data: {name: 'Add office dialog'}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  onOpenJoinOfficeDialog(): void {
    // const dialogRef = 
    this.dialog.open(JoinOfficeDialogComponent, {
      width: '400px',
      data: {name: 'open office dialog' }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

}
