import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { User } from './../../models/user-model';
import { UserProvider } from '../../providers/user/user';

/**
 * Modal to show user details.
 */
@IonicPage()
@Component({
  selector: 'page-modal-user-details',
  templateUrl: 'modal-user-details.html',
})
export class ModalUserDetailsPage {
  user: User;
  currentLoggedInUser: User;
  loading: boolean = true;
  errorMsg: string = '';

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public userProvider: UserProvider) {

    this.currentLoggedInUser = this.userProvider.getCurrentUser();
    const user = this.navParams.get('user');
    this.loadUser(user);
  }

  loadUser(user: User) {
    this.userProvider.getUserById(user.id)
      .then(user => {
        console.log(JSON.stringify(user));
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
