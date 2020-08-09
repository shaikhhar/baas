import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlace: Place[];
  allPlaces: Place[];
  private placeSub: Subscription;
  constructor(private placeService: PlacesService, private authService: AuthService) {}

  ngOnInit() {
    this.placeSub = this.placeService.places.subscribe((places) => {
      this.allPlaces = places;
      this.loadedPlace = this.allPlaces;
    });
  }

  ionViewWillEnter() {
    this.placeService.fetchPlaces().subscribe();
  }

  onFilterUpdate(event) {
    this.authService.userId.pipe(take(1)).subscribe(userId=>{
      if (event.detail.value === 'all') {
        this.loadedPlace = this.allPlaces;
        console.log(this.loadedPlace);
      } else {
        this.loadedPlace = this.allPlaces.filter((place) => place.userId !== userId);
        console.log(this.loadedPlace);
      }
    })
  
  }

  ngOnDestroy() {
    this.placeSub.unsubscribe();
  }
}
