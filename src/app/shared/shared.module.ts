import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './pickers/map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
  imports: [IonicModule, CommonModule],
  exports: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
})
export class sharedModule {}
