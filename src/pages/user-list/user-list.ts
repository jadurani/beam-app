import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';

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
  public users: User[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserListPage');
    this.getUsers();
  }

  getUsers() {
    this.userProvider.getUsers()
      .subscribe(users => this.users = users);
  }
}
