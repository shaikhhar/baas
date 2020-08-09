import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick = new EventEmitter<string>();
  selectedImage: any;
  userPicker = false;
  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('Hybrid: ', this.platform.is('hybrid'));
    if (!this.platform.is('hybrid')) {
      this.userPicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      console.log('camera plugin not available');
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        this.selectedImage = image.base64String;
        this.imagePick.emit(image.base64String);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  onFileChosen(event: any) {
    console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (eve) => {
        // called once readAsDataURL is completed
        this.selectedImage = eve.target.result;
        this.imagePick.emit(this.selectedImage);
      };
    }
  }
}
