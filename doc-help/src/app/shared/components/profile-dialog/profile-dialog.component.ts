import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {

  title: string;

  @ViewChild('codeInput') codeInput: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = data.title;
   }

   onSubmit(): void {
     this.data.success = true;
     this.dialogRef.close();
   }

   onNoClick(): void {
    this.data.success = false;
    this.dialogRef.close();
  }

}
