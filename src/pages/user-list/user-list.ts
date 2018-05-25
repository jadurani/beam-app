import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';
import { ModalUserDetailsPage } from '../modal-user-details/modal-user-details';

/**
 * Generated class for the UserListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {
  users: User[];
  loading: boolean = true;

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
    this.getUsers();
  }

  getUsers() {
    this.userProvider.getUsers()
      .then(users => {
        this.users = users
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  showUserDetails(user: User) {
    // we're passing the id only, supposing the ID above is just a minified version of UserObject
    const userModal = this.modalCtrl.create(ModalUserDetailsPage, { user });
    userModal.present();
  }
}
