import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { User, UserBodyInfo } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-modal-add-body-info',
  templateUrl: 'modal-add-body-info.html',
})
export class ModalAddBodyInfoPage {
  user: User;
  addBodyInfoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
  ) {
    this.user = this.navParams.get('userToEdit');
    this.createForm(this.user);
  }

  createForm(user: User) {
    const dateToday = new Date();
    this.addBodyInfoForm = this.formBuilder.group({
      dateTaken: [dateToday.toISOString(), Validators.required],
      trueAge: [dateToday.getFullYear() - this.user.dateOfBirth.getFullYear(), Validators.required],
      weight: [null, Validators.required],
      height: [null, Validators.required],
      percBodyFat: [null, Validators.required],
      visceralFatRating: [null, Validators.required],
      restingMetabolism: [null, Validators.required],
      bodyAge: [null, Validators.required],
      bmi: [null, Validators.required],
      subcutaneousMeasurements: this.formBuilder.group({
        total: [null, Validators.required],
        trunk: [null, Validators.required],
        arms: [null, Validators.required],
        legs: [null, Validators.required],
      }),
      skeletalMeasurements: this.formBuilder.group({
        total: [null, Validators.required],
        trunk: [null, Validators.required],
        arms: [null, Validators.required],
        legs: [null, Validators.required],
      }),
    });
  }

  save() {
    if (this.addBodyInfoForm.invalid) return;

    this._prepareBodyInfo();
    let toast = this.toastCtrl.create({
      message: 'Recording new fitness parameters...',
      position: 'bottom',
    });
    toast.present();

    this.userProvider.addBodyInfo(this.user)
      .then(updatedUser => {
        toast.dismiss();
        this.viewCtrl.dismiss(updatedUser);
      })
      .catch(error => {
        toast.dismiss();

        toast = this.toastCtrl.create({
          message: error.message || 'Server Error. Try again later',
          position: 'bottom',
          duration: 3000,
        });
        toast.present();
      });
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }

  _prepareBodyInfo () {
    const formModel = this.addBodyInfoForm.value;

    const newUserBodyInfo = new UserBodyInfo(
      this.user.id,
      formModel.dateTaken,
      formModel.trueAge,
      formModel.weight,
      formModel.height,
      formModel.percBodyFat,
      formModel.visceralFatRating,
      formModel.restingMetabolism,
      formModel.bodyAge,
      formModel.bmi,
      Object.assign({}, formModel.subcutaneousMeasurements),
      Object.assign({}, formModel.skeletalMeasurements)
    );
    this.user.setFitnessParams(newUserBodyInfo);
  }
}
