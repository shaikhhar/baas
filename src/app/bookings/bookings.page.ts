import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingSub: Subscription;
  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.bookingService.fetchBookings().subscribe(bookedPlace=>console.log(bookedPlace));
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    this.bookingService.cancelBooking(bookingId).subscribe(() => {
      slidingEl.close();
      console.log(bookingId);
    });
  }
  ngOnDestroy() {
    this.bookingSub.unsubscribe();
  }
}
