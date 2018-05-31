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
  loading: boolean;
  errorMsg: string = '';

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {

    this.currentLoggedInUser = this.userProvider.getCurrentUser();
    const userToView = this.navParams.get('userToView');
    const reloadUser = this.navParams.get('reloadUser');
    if (reloadUser) {
      this.loadUser(userToView);
    } else {
      this.user = userToView;
    }
  }

  loadUser(user: User) {
    this.loading = true;
    this.userProvider.getUserById(user.id)
    .then(user => {
      this.user = user;
      this.loading = false;
    })
    .catch(error => {
      console.log(error);
      this.loading = false;
      this.errorMsg = error.message;
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  canEdit() {
    return this.currentLoggedInUser.roles && this.currentLoggedInUser.roles.owner;
  }

  editUser() {
    this.viewCtrl.dismiss({ editUser: true, user: this.user });
  }

  addNewFitnessParams() {
    this.viewCtrl.dismiss({ addBodyInfo: true, user: this.user});
  }
}
