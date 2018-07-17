import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AddEditMemberPage } from '../add-edit-member/add-edit-member';
import { User } from './../../models/user-model';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-view-member',
  templateUrl: 'view-member.html',
})
export class ViewMemberPage {
  loading: boolean = true;
  profileExpanded: boolean = false;
  addEditMemberPage: any = AddEditMemberPage;
  user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider
  ) {
    this.user = this.navParams.get('user');
  }

  /**
   * Reload the user object every time this page
   * is about to load.  Useful when we just updated
   * the details of the user in the AddEditMemberPage.
   */
  ionViewWillEnter() {
    this.loading = true;
    this.loadUser(this.user);
  }

  loadUser(user: User) {
    this.userProvider.getUserById(user.id)
      .then(user => {
        this.user = user;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      });
  }

  /**
   * Expands Basic Profile Info Section when true.
   */
  profileToggle() {
    this.profileExpanded = !this.profileExpanded;
  }
}

const MOCK_USER: User = {
  "address": {
    "barangay": "Brgy. Shaw",
    "city": "Quezon City",
    "street": "30-B Diamond Towers"
  },
  "dateJoined": new Date(),
  "dateOfBirth": new Date(),
  "displayName": "Perry",
  "email": "perry.ramos@gmail.com",
  "fullName": "Perry Ramos",
  "iceContact": {
    "contactNumber": "+639999999999",
    "email": "peresita.ramos@gmail.com",
    "name": "Peresita Ramos",
    "relationship": "sibling",
    "socialMedia": null
  },
  "id": "YZvKj09nkM1q5u00iJ9D",
  "otherRemarks": "Allergic to peanuts, gluten, and homophobes",
  "phoneNumbers": [
    {
      "label": null,
      "number": "09088679753"
    }
  ],
  "roles": {
    "client": true
  },
  "workDetails": {
    "title": "Web Designer",
    "company": "Zoom",
  }
};
