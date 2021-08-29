import { environment } from './../environments/environment.prod';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'doc-help';
  constructor() {
    
  }

  ngAfterViewInit(): void {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleMapKey + "&libraries=places&language=en"; // replace by your API key
    googleMapsScript.type = 'text/javascript';
    document.body.appendChild(googleMapsScript);
  }
}
