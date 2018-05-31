import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { User } from './../../models/user-model';
import { UserProvider } from '../../providers/user/user';

import { ModalUserDetailsPage } from '../modal-user-details/modal-user-details';
import { ModalEditUserPage } from '../modal-edit-user/modal-edit-user';
import { ModalAddBodyInfoPage } from '../modal-add-body-info/modal-add-body-info';
import { ModalAddUserPage } from '../modal-add-user/modal-add-user';

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
    this.getUsers();
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
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  /**
   * Initialize ModalAddUser
   *
   * On dismiss after a successful save, ModalUserDetails
   * opens and shows the details of the newly-created user.
   * The savedUser also gets pushed to `users`, thus updating
   * this page's list of users.
   */
  showAddUser() {
    const addUserModal = this.modalCtrl.create(ModalAddUserPage);
    addUserModal.onDidDismiss(savedUser => {
      if (savedUser) {
        this.users.push(savedUser);
        this.showUserDetails(savedUser, false);
      }
    });
    addUserModal.present();
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

  showAddBodyInfo(userToEdit: User) {
    const addBodyInfoModal = this.modalCtrl.create(ModalAddBodyInfoPage, { userToEdit });
    addBodyInfoModal.onDidDismiss(savedUser => {
      if (savedUser) {
        this.showUserDetails(savedUser, false);
      } else {
        this.showUserDetails(userToEdit, false);
      }
    });
    addBodyInfoModal.present();
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

    userModal.onDidDismiss((returnObj) => {
      if (!returnObj) return;

      if (returnObj.editUser) {
        this.showEditUser(returnObj.user);
      } else if (returnObj.addBodyInfo) {
        this.showAddBodyInfo(returnObj.user);
      }
    });

    userModal.present();
  }
}
