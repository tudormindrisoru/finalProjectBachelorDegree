import { environment } from './../../../../environments/environment';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import H from '@here/maps-api-for-javascript';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  private map?: H.Map;
  private timeoutHandle: any;
  private platform: H.service.Platform;
  private zoom: number = 14;

  @Input() public lat?: number;
  @Input() public lng?: number;

  @Output() notify = new EventEmitter();
  @ViewChild('map') mapElement?: ElementRef;

  private clearMarkers(): void {
    this.map.removeObjects(this.map.getObjects());
  }

  private dropMarker(coordinates: any) {
    let marker = new H.map.Marker(coordinates);
    this.map.addObject(marker);
  }

  ngAfterViewInit(): void {
    if (!this.map && this.mapElement) {
      // instantiate a platform, default layers and a map as usual
      this.platform = new H.service.Platform({
        apikey: environment.hereMapsAPIKey,
      });
      // const layers = platform.createDefaultLayers();
      let defaultLayers = this.platform.createDefaultLayers();
      this.map = new H.Map(
        this.mapElement.nativeElement,
        defaultLayers.vector.normal.map,
        {
          zoom: this.zoom,
          center: { lat: this.lat || 47.151726, lng: this.lng || 27.587914 },
        }
      );
      if (this.lat && this.lat) {
        this.clearMarkers();
        this.dropMarker({ lng: this.lng, lat: this.lat });
      }
    }

    this.map.addEventListener('mapviewchange', (ev: H.map.ChangeEvent) => {
      this.notify.emit(ev);
    });
    new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
  }

  ngOnChanges(changes: SimpleChanges): void {
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      if (this.map) {
        if (changes.zoom !== undefined) {
          this.map.setZoom(changes.zoom.currentValue);
        }
        if (changes.lat !== undefined) {
          this.map.setCenter({ lat: changes.lat.currentValue, lng: this.lng });
        }
        if (changes.lng !== undefined) {
          this.map.setCenter({ lat: this.lat, lng: changes.lng.currentValue });
        }
        if (this.lat && this.lat) {
          this.clearMarkers();
          this.dropMarker({ lng: this.lng, lat: this.lat });
        }
      }
    }, 100);
  }

  handleMapChange(event: H.map.ChangeEvent): void {
    if (event.newValue.lookAt) {
      const lookAt = event.newValue.lookAt;
      this.zoom = lookAt.zoom;
      this.lat = lookAt.position.lat;
      this.lng = lookAt.position.lng;
    }
  }

  ngOnDestroy(): void {
    this.map.removeEventListener('mapviewchange', (ev: H.map.ChangeEvent) => {
      this.notify.emit(ev);
    });
  }
}
