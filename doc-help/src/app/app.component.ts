import { AfterViewInit, Component } from '@angular/core';
import { SecretKeys } from 'src/environments/secret-keys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'doc-help';
  constructor(private secretKeys: SecretKeys) {
    
  }

  ngAfterViewInit(): void {
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=" + this.secretKeys.googleMapsKey + "&libraries=places&language=en"; // replace by your API key
    googleMapsScript.type = 'text/javascript';
    document.body.appendChild(googleMapsScript);
  }
}
