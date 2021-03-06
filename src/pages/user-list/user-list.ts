import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';

import { User } from './../../models/user-model';
import { UserProvider } from '../../providers/user/user';

import { AddEditMemberPage } from '../add-edit-member/add-edit-member';
import { ViewMemberPage } from '../view-member/view-member';

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

  FULL_NAME: string = 'fullName';
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
    this.userProvider.getUsers()
      .then(users => {
        this.users = users.filter(user => user.roles.client);
        this.unfilteredUserList = users;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
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

    let userASortValue;
    let userBSortValue;

    this.users.sort((userA, userB) => {
      if (propertyName === this.FULL_NAME) {
        userASortValue = userA.fullName.toUpperCase();
        userBSortValue = userB.fullName.toUpperCase();
      } else if (propertyName === this.NEXT_PAYMENT_DATE) {
        // TO DO: Replace with real next payment date
        userASortValue = userA.dateJoined.getTime();
        userBSortValue = userB.dateJoined.getTime();
      }

      if (userASortValue < userBSortValue) return this.descOrder ? 1 : -1;
      if (userASortValue > userBSortValue) return this.descOrder ? -1 : 1;
      return 0;
    });

    this.loading = false;
  }
}
