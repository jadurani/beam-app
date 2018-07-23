import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { BodyInfoProvider } from '../../providers/body-info/body-info';

import { User, UserBodyInfo } from './../../models/user-model';
import { ModalAddBodyInfoPage } from '../../pages/modal-add-body-info/modal-add-body-info';


@Component({
  selector: 'fitness-parameters',
  templateUrl: 'fitness-parameters.html'
})
export class FitnessParametersComponent {
  @Input() user: User;
  viewType: string;
  bodyInfoArray: any;
  LIST_VIEW: string = 'list';
  CHART_VIEW: string = 'chart';

  constructor(
    private bodyInfoProvider: BodyInfoProvider,
    private modalCtrl: ModalController,
  ) {
    this.viewType = this.LIST_VIEW;
  }

  /**
   * Opens modal to add a new record for
   * Member's Fitness Parameters.
   */
  addFitnessParams() {
    const addBodyInfoModal = this.modalCtrl.create(
      ModalAddBodyInfoPage, { userToEdit: this.user }
    );

    addBodyInfoModal.onDidDismiss(
      (newUserBodyInfo: UserBodyInfo) => {
        if (newUserBodyInfo)
          this.user.bodyInfo = newUserBodyInfo;
      });
    addBodyInfoModal.present();
  }

  getAllBodyInfoForUser() {
    this.bodyInfoProvider.getAllBodyInfoForUser(this.user)
      .then(bodyInfoList => {
        this.bodyInfoArray = bodyInfoList;
      });
  }

  getListView() {
    this.viewType = this.LIST_VIEW;
  }

  getChartView() {
    this.getAllBodyInfoForUser();
    this.viewType = this.CHART_VIEW;
  }
}
