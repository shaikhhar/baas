import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { tap, map, take, switchMap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class BookingService {
  bookingArray = [];
  private _bookings = new BehaviorSubject<Booking[]>([]);
  constructor(private authService: AuthService, private http: HttpClient) {}

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId,
    placeTitle,
    placeImage,
    firstName,
    lastName,
    guestNumber,
    bookedFrom: Date,
    bookedTo: Date
  ) {
    return  this.authService.userId.pipe(
      take(1),
      map((userId) => {
        if (!userId) {
          return;
        }
        const newBooking = new Booking(
          Math.random().toString(),
          placeId,
          placeTitle,
          placeImage,
          userId,
          firstName,
          lastName,
          guestNumber,
          bookedFrom,
          bookedTo
        );
        return this.http
          .post(
            "https://ionic-angular-course-d6c90.firebaseio.com/bookings.json",
            { ...newBooking, id: null }
          )
          .subscribe(
            (booking) => {
              console.log(booking);
              newBooking.id = booking["name"];
              this.bookingArray.push(newBooking);
              this._bookings.next(this.bookingArray);
            }
          );
      })
    );
  }

  fetchBookings() {
    return  this.authService.userId.pipe(take(1),switchMap((userId)=>{
      return this.http
      .get(
        `https://ionic-angular-course-d6c90.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`
      )
      .pipe(
        map((bookings) => {
          console.log('bookings: ', bookings)
          let bookedPlace: Booking[] = [];
          let b: Booking;
          // tslint:disable-next-line: forin
          for (const key in bookings) {
            b = { ...bookings[key], id: key }; //b means bookingValue
            bookedPlace.push(b);
          }

          this.bookingArray = bookedPlace;
          this._bookings.next(this.bookingArray);
          return bookedPlace;
        })
      );
    }))
  
  }
  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://ionic-angular-course-d6c90.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        tap((updatedBooking) => {
          console.log(updatedBooking);
          this.fetchBookings().subscribe((latestBookingData) => {
            console.log("latest Booking data", latestBookingData);
            this._bookings.next(latestBookingData);
          });
        })
      );
  }
}

// [
//   {
//     id: 'xyz',
//     placeId: 'p1',
//     placeTitle: 'Kathmandu Mansion',
//     guestNumber: 2,
//     userId: 'abc',
//   },
// ];
