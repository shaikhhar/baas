import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center = { lat: 27.7, lng: 85.3 };
  @Input() selectable = true;
  @Input() closeButtonText = 'cancel';
  @Input() title = 'Pick Location';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then((googleMaps: any) => {
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
        });
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          mapEl.classList.add('visible');
        });
        if (this.selectable) {
          map.addListener('click', (event) => {
            const selectedCoords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
            this.modalCtrl.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location',
          });
          marker.setMap(map);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps() {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps sdk not available');
        }
      };
    });
  }
}
