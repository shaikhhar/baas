import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  isLoading = false;
  isLogin = true;
  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.isLoading = true;

    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in ' }).then((loadingEl) => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;

      if (this.isLogin) {
        console.log('loggin in')
        authObs = this.auth.login(email, password);
      } else {
        console.log('signin up')
        authObs = this.auth.signup(email, password);
      }

      authObs.subscribe(
        (resData) => {
          console.log(resData);
          this.loadingCtrl.dismiss();
          this.isLoading = false;
          this.router.navigateByUrl('/places/tabs/discover');
        },
        (error) => {
          this.loadingCtrl.dismiss();
          this.alertCtrl.create({ message: 'Invalid login' }).then((alertEl) => alertEl.present());
        }
      );
    });
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email, password);
  }

  onSwitchLoginMode() {
    console.log('mode: ', this.isLogin);
    this.isLogin = !this.isLogin;
  }
}
