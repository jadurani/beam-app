import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';
import { ModalUserDetailsPage } from '../modal-user-details/modal-user-details';
import { ModalEditUserPage } from '../modal-edit-user/modal-edit-user';

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
    // this.getUsers();
    const user = this.userProvider.mockUser;
    this.showEditUser(user);
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

  // showEditUser(user: User) {
  showEditUser(user: any) {
    const editUserModal = this.modalCtrl.create(ModalEditUserPage, { user });
    editUserModal.onDidDismiss(savedUser => {
      console.log(savedUser);
    });
    editUserModal.present();
  }

  showUserDetails(user: User) {
    const userModal = this.modalCtrl.create(ModalUserDetailsPage, { user });
    userModal.onDidDismiss(editUser => {
      if (editUser) this.showEditUser(user);
    });
    userModal.present();
  }
}
