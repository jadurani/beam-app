import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';

import { User } from './../../models/user-model';
import { UserProvider } from '../../providers/user/user';

import { AddEditMemberPage } from '../add-edit-member/add-edit-member';
import { ViewMemberPage } from '../view-member/view-member';
import { ModalUserDetailsPage } from '../modal-user-details/modal-user-details';
import { ModalEditUserPage } from '../modal-edit-user/modal-edit-user';
import { ModalAddBodyInfoPage } from '../modal-add-body-info/modal-add-body-info';
import { ModalAddUserPage } from '../modal-add-user/modal-add-user';

import { SearchUserHelper } from './search-user-helper';

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
    entryComponents: [AddEditMemberPage, ViewMemberPage],
})
export class UserListPage {
  users: User[];
  unfilteredUserList: User[];

  addEditMemberPage: any;
  viewMemberPage: any;

  propertySortName: string;
  descOrder: boolean;
  searchControl: FormControl;
  searchTerm: string;
  searchUserHelper: SearchUserHelper;

  loading: boolean;

  // TO DO: Change to next payment date
  NEXT_PAYMENT_DATE: string = 'dateJoined';
  ASCENDING_ORDER: string = 'asc';
  DESCENDING_ORDER: string = 'desc';

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private userProvider: UserProvider,
  ) {
    this.addEditMemberPage = AddEditMemberPage;
    this.searchUserHelper = new SearchUserHelper();
    this.viewMemberPage = ViewMemberPage;
    this.searchControl = new FormControl();
    this.searchTerm = '';

    this.loading = true;
    this.descOrder = true;
    this.propertySortName = this.NEXT_PAYMENT_DATE;
  }

  ionViewDidLoad() {
    this.getUsers();

    this.searchControl
      .valueChanges
      .debounceTime(700)
      .subscribe(() => {
        this.searchTerm = this.searchTerm.trim();
        this.users = this.unfilteredUserList;
        if (this.searchTerm) {
          let matchedUsers = this.searchUserHelper
            .getMatches(this.searchTerm);
          this.users = this._getFilteredUserList(matchedUsers);
        }
        this.loading = false;
      });
  }

  /**
   * Gets all user instance that have matched the search term.
   * @param matchedUsers
   */
  private _getFilteredUserList(matchedUsers) {
    let filteredUserList = [];
    matchedUsers.forEach(matchedUser => {
      this.users.forEach(user => {
        if (matchedUser.id === user.id)
          filteredUserList.push(user);
      });
    });
    return filteredUserList;
  }

  /**
   * Load all the users from the database.
   */
  getUsers(): void {
    let sortOrder = this.descOrder ? this.DESCENDING_ORDER : this.ASCENDING_ORDER;
    this.userProvider.getUsers(
      this.propertySortName, sortOrder
    )
    .then(users => {
      this.users = users;
      this.unfilteredUserList = users;
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

  /**
   * Reloads the user list every time the sort function is called.
   *
   * @param propertyName The User property we're sorting the user list on
   */
  sortBy(propertyName: string) {
    this.loading = true;
    this.descOrder = propertyName === this.propertySortName ? !this.descOrder : true;
    this.propertySortName = propertyName;

    if (this.searchTerm) {
      this.users.sort((userA, userB) => {
        let userAName = userA.fullName.toUpperCase();
        let userBName = userB.fullName.toUpperCase();
        if (userAName < userBName) return this.descOrder ? 1 : -1;
        if (userAName > userBName) return this.descOrder ? -1 : 1;
        return 0;
      });
      this.loading = false;
      return;
    }

    this.getUsers();
  }
}
