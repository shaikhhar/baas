import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { sharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlaceDetailPageRoutingModule, sharedModule],
  declarations: [PlaceDetailPage, CreateBookingComponent],
})
export class PlaceDetailPageModule {}
