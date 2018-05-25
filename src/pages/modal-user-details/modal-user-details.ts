import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { User } from './../../models/user-model';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ModalUserDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-user-details',
  templateUrl: 'modal-user-details.html',
})
export class ModalUserDetailsPage {
  user: User;
  loading: boolean = true;
  errorMsg: string = '';

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public userProvider: UserProvider) {

    const user = this.navParams.get('user');
    this.loadUser(user);
  }

  // later on to be basic info
  loadUser(user: User) {
    this.userProvider.getUserById(user.id)
      .then(user => {
        this.user = user;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.errorMsg = error.message;
      });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
