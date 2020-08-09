import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { PlaceLocation } from '../../../../app/places/location.model';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  selectedLocationImage: string;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCtrl
      .create({
        header: 'Please choose',
        buttons: [
          {
            text: 'Auto-locate',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            },
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      })
      .then((actionSheet) => actionSheet.present());
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.alertCtrl.create({ header: 'couldnt autolocate, select on map' }).then((alertCtrl) => alertCtrl.present());
      return;
    }
    Plugins.Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        console.log('Current', geoPosition.coords.latitude);
        const coordinates = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
        this.createPlace(coordinates.lat, coordinates.lng);
      })
      .catch((err) => {
        this.alertCtrl
          .create({ header: 'couldnt autolocate', message: JSON.parse(JSON.stringify(err)) })
          .then((alertCtrl) => alertCtrl.present());
        console.log(err);
      });
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData) {
          return;
        }
        const coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.getAddress(lat, lng)
      .pipe(
        map((address) => {
          pickedLocation.address = address;
          return this.getMapImage(pickedLocation.lat, pickedLocation.lng, 16);
        })
      )
      .subscribe((staticMapImageUrl) => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`)
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData['results'][0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:S%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
  }
}
