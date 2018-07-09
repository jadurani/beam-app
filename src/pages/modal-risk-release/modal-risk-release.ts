import { Component } from '@angular/core';
import {
  IonicPage,
  ViewController
} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-risk-release',
  templateUrl: 'modal-risk-release.html',
})
export class ModalRiskReleasePage {

  constructor(private viewCtrl: ViewController) {}

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
