import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;
  title: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placesService.getPlace(paramMap.get('placeId')).subscribe((place) => {
        this.place = place;
        this.title = place.title;
      });
    });
  }
  onUpdateOffer(form: NgForm) {
    this.placesService.updateOffer(this.place.id, form.value.title, form.value.description);
    form.reset();
    this.router.navigate(['/places/tabs/offers']);
  }
}
