import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // ngOnInit(): void {
  //   this.loadScript();
  // }
  // public loadScript(): void {
  //   const script = document.createElement('script');
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.hereMapsAPIKey}&libraries=places&language=en`;
  //   script.async = true;
  //   document.body.appendChild(script);
  // }
}
