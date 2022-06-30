import { environment } from 'src/environments/environment';
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
import onResize from 'simple-element-resize-detector';
import { SearchResult } from 'src/app/shared/models/models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public lat?: number;
  @Input() public lng?: number;

  private map?: H.Map;
  private platform: H.service.Platform;
  private service: H.service.SearchService;
  private timeoutHandle: any;
  private markersGroup: H.map.Group;

  @Output() notify = new EventEmitter<any>();

  @ViewChild('map')
  public mapElement: ElementRef;

  constructor() {
    this.platform = new H.service.Platform({
      apikey: environment.hereMapsAPIKey,
    });
  }

  clearMarkers(): void {
    if (this.markersGroup) {
      this.markersGroup.removeObjects(this.markersGroup.getObjects());
    }
  }

  addMarkOnMap(lat, lng): void {
    this.clearMarkers();
    if (this.markersGroup && lat && lng) {
      const marker = new H.map.Marker({ lat, lng } as H.geo.Point);
      this.markersGroup.addObject(marker);
    }
  }

  addressSearch(value: string): any {
    if (this.map && this.service && value !== '') {
      this.service.geocode(
        {
          q: value,
          in: 'countryCode:ROU',
        },
        (result) => {
          const items = result['items'].map((element) => {
            return {
              address: element.address.label,
              county: element.address.county,
              lat: element.position.lat,
              lng: element.position.lng,
            } as SearchResult;
          });
          if (items.length > 0) {
            this.notify.emit(items);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  ngAfterViewInit(): void {
    if (!this.map && this.mapElement) {
      const layers = this.platform.createDefaultLayers();
      const map = new H.Map(
        this.mapElement.nativeElement,
        layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: { lat: this.lat ?? 45.9442858, lng: this.lng ?? 25.0094303 },
          zoom: 12,
        }
      );
      onResize(this.mapElement.nativeElement, () => {
        map.getViewPort().resize();
      });
      this.markersGroup = new H.map.Group();
      map.addObject(this.markersGroup);

      if (this.lat && this.lng) {
        this.addMarkOnMap(this.lat, this.lng);
      }

      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      this.map = map;

      this.service = this.platform.getSearchService();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
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

        if (
          changes.lat.currentValue !== undefined &&
          changes.lng.currentValue !== undefined &&
          (changes.lat.previousValue !== this.lat ||
            changes.lng.previousValue !== this.lng)
        ) {
          this.addMarkOnMap(changes.lat.currentValue, changes.lng.currentValue);
        }
      }
    }, 100);
  }

  ngOnDestroy(): void {}
}
