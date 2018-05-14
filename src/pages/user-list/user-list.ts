import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';
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
  public users: User[];

  constructor(
    public modalCtrl: ModalController,
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

  showUserDetails(user: User) {
    console.log(user);
    // we're passing the id only, supposing the ID above is just a minified version of UserObject
    const userModal = this.modalCtrl.create(ModalUserDetailsPage, {userId: user.id});
    userModal.present();
  }
}
