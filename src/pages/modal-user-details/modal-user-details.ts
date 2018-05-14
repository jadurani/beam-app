import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';

/**
 * Generated class for the ModalUserDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-user-details',
  templateUrl: 'modal-user-details.html',
})
export class ModalUserDetailsPage {
  user: User;
  // we may need a minimal user later

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public userProvider: UserProvider) {

    const userId = this.navParams.get('userId');
    this.loadUser(userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalUserDetailsPage');
  }

  loadUser(userId: any) {
    this.userProvider.getUserById(userId)
      .subscribe(user => {
        this.user = user;
        console.log('meow here');
      });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
