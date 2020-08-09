import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { map, tap, take, takeLast, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { PlaceLocation } from "./location.model";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  placeArray = [];

  private _places = new BehaviorSubject<Place[]>(this.placeArray);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlace(id: string) {
    return this.places.pipe(
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  fetchPlaces() {
    return this.http
      .get(
        "https://ionic-angular-course-d6c90.firebaseio.com/offered-places.json"
      )
      .pipe(
        map((res) => {
          const places = [];
          // tslint:disable-next-line: forin
          for (const key in res) {
            places.push(
              new Place(
                key,
                res[key].title,
                res[key].description,
                res[key].imageUrl,
                res[key].price,
                new Date(res[key].from),
                new Date(res[key].to),
                res[key].userId,
                res[key].location
              )
            );
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
          this.placeArray = places;
        })
      );
  }

  fetchOffers() {
    return this.authService.userId.pipe(
      take(1),
      switchMap((uid) => {
        return this.http
          .get(
            "https://ionic-angular-course-d6c90.firebaseio.com/offered-places.json"
          )
          .pipe(
            map((res) => {
              const places = [];
              // tslint:disable-next-line: forin
              for (const key in res) {
                console.log("user id ", uid);
                if (res[key].userId === uid) {
                  places.push(
                    new Place(
                      key,
                      res[key].title,
                      res[key].description,
                      res[key].imageUrl,
                      res[key].price,
                      new Date(res[key].from),
                      new Date(res[key].to),
                      res[key].userId,
                      res[key].location
                    )
                  );
                }
              }
              console.log("offers ", places);
              return places;
            })
          );
      })
    );
  }
  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append("image", image);

    return this.http.post<{ imageUrl: string; imagePath: string }>(
      "https://us-central1-ionic-angular-course-d6c90.cloudfunctions.net/storeImage",
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    from: Date,
    to: Date,
    location: PlaceLocation,
    imageUrl
  ) {
    return this.authService.userId.pipe(
      map((userId) => {
        const newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          from,
          to,
          userId,
          location
        );
        // this.placeArray.push(newPlace);
        this.http
          .post(
            "https://ionic-angular-course-d6c90.firebaseio.com/offered-places.json",
            { ...newPlace, id: null }
          )
          .subscribe((place) => {
            console.log(place);
            newPlace.id = place["name"];
            this.placeArray.push(newPlace);
            this._places.next(this.placeArray);
          });
      })
    );
  }

  updateOffer(placeID: string, title: string, description: string) {
    this.getPlace(placeID)
      .pipe(take(1))
      .subscribe((place) => {
        place.title = title;
        place.description = description;
        console.log("to update place ", place);
        this.http
          .put(
            `https://ionic-angular-course-d6c90.firebaseio.com/offered-places/${placeID}.json`,
            place
          )
          .pipe(
            map((updatedplace) => {
              return updatedplace;
            })
          )
          .subscribe((newPlace) => {
            console.log("updated place " + newPlace);
            this.fetchPlaces().subscribe((places) => {
              this._places.next(places);
            });
          });
      });
  }
}
