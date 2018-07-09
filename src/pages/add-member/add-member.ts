import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { ModalRiskReleasePage } from '../modal-risk-release/modal-risk-release';

/**
 * Generated class for the AddMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {

  constructor(public modalCtrl: ModalController) {
  }


  openModalRiskRelease() {
    const riskReleaseModal = this.modalCtrl.create(ModalRiskReleasePage);
    riskReleaseModal.present();
  }
}
