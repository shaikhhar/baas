import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../place.model";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedPlaces: Place[] = [];
  isLoading = false;
  private placeSub: Subscription;
  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placeSub = this.placesService.fetchOffers().subscribe((places) => {
      this.loadedPlaces = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchOffers().subscribe((offers) => {
      this.loadedPlaces = offers;
      this.isLoading = false;
    });
  }

  onEdit(placeId) {
    this.router.navigate(["/places/tabs/offers/edit", placeId]);
    console.log(placeId);
  }

  ngOnDestroy() {
    this.placeSub.unsubscribe();
  }
}
