import { Component, OnInit, Input } from '@angular/core';
import { Place } from '../../places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onBookPlace(form: NgForm) {
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: form.value['first-name'],
          lastName: form.value['last-name'],
          guestNumber: form.value['guest-number'],
          bookedFrom: form.value['date-from'],
          bookedTo: form.value['date-to'],
        },
      },
      'confirm'
    );
  }
}
