import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

export interface DialogData {
  name: string;
}


@Component({
  selector: 'app-add-office-dialog',
  templateUrl: './add-office-dialog.component.html',
  styleUrls: ['./add-office-dialog.component.scss']
})
export class AddOfficeDialogComponent implements OnInit {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  autocompleteOptions = {
    types: [],
    componentRestrictions: { country: 'RO' }
    }
  constructor(
    public dialogRef: MatDialogRef<AddOfficeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder
    ) {}

    markerLat: number;
    markerLng: number;
    lat = 47.17;
    lng = 27.57;
    firstStepForm: FormGroup;
    secondStepForm: FormGroup;
    thirdStepForm: FormGroup;
    
    ngOnInit(): void {
      this.firstStepForm = this._formBuilder.group({
        officeName: ['', Validators.required]
      });
      this.secondStepForm = this._formBuilder.group({
        address: ['', Validators.required]
      });
      this.thirdStepForm = this._formBuilder.group({
        validationCode: ['', Validators.required]
      });
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }

    public handleAddressChange(address: Address) {
      this.markerLat = address.geometry.location.lat();
      this.markerLng = address.geometry.location.lng();
      this.lat = this.markerLat;
      this.lng = this.markerLng;
      console.log(address);
  }
}
