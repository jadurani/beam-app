import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';
import { ModalUserDetailsPage } from '../modal-user-details/modal-user-details';
import { ModalEditUserPage } from '../modal-edit-user/modal-edit-user';

/**
 * @constant USE_MOCK
 * Set this variable to true when on staging mode.
 */
const USE_MOCK = true;

/**
 * UserListPage
 *
 * Lists users from our database.
 * Clicking on a user item in the list shows up
 * the user details modal.
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
    if (!USE_MOCK)
      this.getUsers();
    else {
      const user = this.userProvider.mockUser;
      this.showEditUser(user);
    }
  }

  /**
   * Load all the users from the database.
   */
  getUsers(): void {
    this.userProvider.getUsers()
      .then(users => {
        this.users = users
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  /**
   * Initialize ModalEditUser, passing the currently viewed user
   * to the modal.
   *
   * Called by ModalUserDetails upon dismissal.
   * On its own dismissal, it passes the updated user object back
   * to ModalUserDetails to avoid repeatedly loading the object
   * that has apparently just been saved.
   *
   * @param userToEdit {User}   User object whose details are about
   * to be viewed and edited through ModalEditUser.
   */
  showEditUser(userToEdit: User) {
    const editUserModal = this.modalCtrl.create(ModalEditUserPage, { userToEdit });
    editUserModal.onDidDismiss(savedUser => {
      if (savedUser) {
        this.showUserDetails(savedUser, false);
      } else {
        this.showUserDetails(userToEdit, false);
      }
    });
    editUserModal.present();
  }

  /**
   * Initialize ModalUserDetails, passing the clicked user in the list
   * to the modal.
   *
   * On dismiss, this can either show the edit user modal or plainly
   * just dismiss.
   *
   * @param userToView {User}   User object whose details are about
   * to be viewed through ModalUserDetails.
   * @param isMinimal {boolean} If true, then ModalUserDetails will
   * have to load the full User instance all the way from the database.
   */
  showUserDetails(userToView: User, isMinimal: boolean = true) {
    const userModal = this.modalCtrl.create(
      ModalUserDetailsPage, {
        userToView,
        reloadUser: isMinimal
      });

    userModal.onDidDismiss((fullUser: User) => {
      if (fullUser) this.showEditUser(fullUser);
    });

    userModal.present();
  }
}
