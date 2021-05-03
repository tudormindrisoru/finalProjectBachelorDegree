import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileImage: string | ArrayBuffer = '../../../assets/user.png';

  genders = ['Male', 'Female', 'Unknown'];

  constructor() { }

  ngOnInit(): void {
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
}
