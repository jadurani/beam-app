import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ViewController
} from 'ionic-angular';

/**
 * Contains the Terms and Conditions which the user
 * can only check by scrolling all the way to the bottom
 * of the modal.
 */
@IonicPage()
@Component({
  selector: 'page-modal-risk-release',
  templateUrl: 'modal-risk-release.html',
})
export class ModalRiskReleasePage {
  signed: boolean;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.signed = this.navParams.get('signedRelease');
  }

  toggleCheckMark() {
    this.signed = !this.signed;
  }

  closeModal() {
    this.viewCtrl.dismiss(this.signed);
  }
}
