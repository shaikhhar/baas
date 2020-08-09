import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { PlacesService } from "../../places.service";
import { Router } from "@angular/router";
import { PlaceLocation } from "../../location.model";
import { map, tap } from "rxjs/operators";
import { LoadingController } from "@ionic/angular";

function b64toBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
}

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"],
})
export class NewOfferPage implements OnInit {
  pickedLocation: PlaceLocation;
  imageBlob: any;
  imageURL: string;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form);
  }

  onLocationPicked(location: PlaceLocation) {
    this.pickedLocation = location;
  }

  onImagePicked(imageData: string) {
    this.imageBlob = b64toBlob(imageData);
    console.log("onImagePicked", this.imageBlob);
  }

  onCreateOffer(form: NgForm) {
    this.loadingCtrl.create({ message: "Creating offer" }).then((loadingEl) => {
      loadingEl.present();
      console.log(form.value.title);
      console.log("created", this.imageBlob);
      if (this.imageBlob) {
        this.placesService
          .uploadImage(this.imageBlob)
          .pipe(
            tap((res) => {
              this.imageURL = res.imageUrl;
              this.addPlace(form);
              this.imageBlob = null;
              this.imageURL = null;
            })
          )
          .subscribe(() => loadingEl.dismiss());
      } else {
        this.addPlace(form);
        loadingEl.dismiss();
      }
    });
  }

  addPlace(form) {
    this.placesService
      .addPlace(
        form.value.title,
        form.value.description,

        form.value.price,

        new Date(form.value.from),
        new Date(form.value.to),
        this.pickedLocation,
        this.imageURL
      )
      .subscribe(() => {
        form.reset();
        this.router.navigate(["/places/tabs/offers"]);
      });
    // console.log(this.placesService.places);
  }
}
