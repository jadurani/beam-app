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

import { DateProvider } from './../../providers/date/date';
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
    private dateProvider: DateProvider,
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
  ) {
    this.user = this.navParams.get('userToEdit');
    this.createForm(this.user);
  }

  createForm(user: User) {
    const dateToday = this.dateProvider.dateNow();
    this.addBodyInfoForm = this.formBuilder.group({
      dateTaken: [dateToday.toISOString(), Validators.required],
      trueAge: [
        (this.user.dateOfBirth ?
          this.dateProvider.getAgeToday(this.user.dateOfBirth) :
          null),
        Validators.required],
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

  get dateTakenError() {
    const formControl = this.addBodyInfoForm.get('dateTaken');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get trueAgeError() {
    const formControl = this.addBodyInfoForm.get('trueAge');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get weightError() {
    const formControl = this.addBodyInfoForm.get('weight');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get heightError() {
    const formControl = this.addBodyInfoForm.get('height');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get percBodyFatError() {
    const formControl = this.addBodyInfoForm.get('percBodyFat');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get visceralFatRatingError() {
    const formControl = this.addBodyInfoForm.get('visceralFatRating');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get restingMetabolismError() {
    const formControl = this.addBodyInfoForm.get('restingMetabolism');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get bodyAgeError() {
    const formControl = this.addBodyInfoForm.get('bodyAge');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get bmiError() {
    const formControl = this.addBodyInfoForm.get('bmi');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required) {
      return 'Required';
    }

    return null;
  }

  get subCutTotalError() {
    const formControl =
      this.addBodyInfoForm.get('subcutaneousMeasurements').get('total');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get subCutTrunkError() {
    const formControl =
      this.addBodyInfoForm.get('subcutaneousMeasurements').get('trunk');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get subCutArmsError() {
    const formControl =
      this.addBodyInfoForm.get('subcutaneousMeasurements').get('arms');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get subCutLegsError() {
    const formControl =
      this.addBodyInfoForm.get('subcutaneousMeasurements').get('legs');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get skeleTotalError() {
    const formControl =
      this.addBodyInfoForm.get('skeletalMeasurements').get('total');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get skeleTrunkError() {
    const formControl =
      this.addBodyInfoForm.get('skeletalMeasurements').get('trunk');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get skeleArmsError() {
    const formControl =
      this.addBodyInfoForm.get('skeletalMeasurements').get('arms');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get skeleLegsError() {
    const formControl =
      this.addBodyInfoForm.get('skeletalMeasurements').get('legs');
    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  private _prepareBodyInfo () {
    const formModel = this.addBodyInfoForm.value;
    const newUserBodyInfo: UserBodyInfo = {
      uid: this.user.id,
      dateTaken: this.dateProvider.stringToDate(formModel.dateTaken),
      trueAge: formModel.trueAge,
      weight: formModel.weight,
      height: formModel.height,
      percBodyFat: formModel.percBodyFat,
      visceralFatRating: formModel.visceralFatRating,
      restingMetabolism: formModel.restingMetabolism,
      bodyAge: formModel.bodyAge,
      bmi: formModel.bmi,
      subcutaneousMeasurements: Object.assign({}, formModel.subcutaneousMeasurements),
      skeletalMeasurements: Object.assign({}, formModel.skeletalMeasurements)
    };
    this.user.bodyInfo = newUserBodyInfo;
  }
}
