import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { User } from 'firebase';
import { ModalAddBodyInfoPage } from '../../pages/modal-add-body-info/modal-add-body-info';

/**
 * Generated class for the FitnessParametersComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'fitness-parameters',
  templateUrl: 'fitness-parameters.html'
})
export class FitnessParametersComponent {
  @Input() user: User;

  constructor(private modalCtrl: ModalController) {}


  /**
   * Opens modal to add a new record for
   * Member's Fitness Parameters
   */
  addFitnessParams() {
    const addBodyInfoModal = this.modalCtrl.create(
      ModalAddBodyInfoPage, { userToEdit: this.user }
    );
    addBodyInfoModal.present();
  }
}
