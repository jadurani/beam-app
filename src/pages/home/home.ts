import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentUser: any;

  constructor(
    public authProvider: AuthProvider,
    public navCtrl: NavController
  ) {
      this.currentUser = this.authProvider.getCurrentUser();
  }
}
