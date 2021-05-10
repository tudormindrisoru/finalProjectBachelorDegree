import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOfficeDialogComponent } from './components/add-office-dialog/add-office-dialog.component';
import { JoinOfficeDialogComponent } from './components/join-office-dialog/join-office-dialog.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileImage: string | ArrayBuffer = '../../../assets/user.png';
  genders = [
    {
      label: 'male',
      icon: 'male',
      color: '#64b3f4'
    },
    {
      label: 'female',
      icon: 'female',
      color: 'pink'
    },
    {
      label: 'unknown',
      icon: 'help_outline',
      color: 'black'
    }];
    specialties = ['Alergologie', 'Balneofizioterapie','Cardiologie','Dermatologie','Endocrinologie','Epidemiologie','Gastroenterologie','Genetica medicala','Hematologie','Hepatologie','Nefrologie','Neonatologie','Neurochirurgie','Neurologie','Ginecologie','Oftalmologie','Oncologie','Ortopedie','Patologie','Pediatrie','Psihiatrie','Reumatologie','Stomatologie','Urologie'];


  userType: string[] = ['patient', 'doctor'];
  cities: string[] = ['Bacau','Iasi','Bucuresti'];
  
  importantInfoFormGroup: FormGroup;
  mainInfoFormGroup: FormGroup;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.importantInfoFormGroup = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });
    this.mainInfoFormGroup = new FormGroup({
      cellPhone: new FormControl('', [ Validators.required ]),
      city: new FormControl('', [ Validators.required]),
      birthDate: new FormControl(new Date()),
      gender: new FormControl({}),
      cuim: new FormControl(''),
      specialty: new FormControl('', [ Validators.required ])
    });
  }

  get selectedGender() {
    return this.mainInfoFormGroup.value.gender !== {} ? this.mainInfoFormGroup.value.gender : undefined;
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
    const dialogRef = this.dialog.open(AddOfficeDialogComponent, {
      width: '400px',
      data: {name: 'Add office dialog'}
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  onOpenJoinOfficeDialog(): void {
    const dialogRef = this.dialog.open(JoinOfficeDialogComponent, {
      width: '400px',
      data: {name: 'open office dialog' }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

}
