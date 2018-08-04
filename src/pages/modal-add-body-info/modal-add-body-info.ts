import { Component, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ToastController,
  ViewController,
  Content,
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';

import { DateProvider } from './../../providers/date/date';
import { User, UserBodyInfo } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';
import { BodyInfoProvider } from '../../providers/body-info/body-info';


@IonicPage()
@Component({
  selector: 'page-modal-add-body-info',
  templateUrl: 'modal-add-body-info.html',
})
export class ModalAddBodyInfoPage {
  @ViewChild(Content) content: Content;

  user: User;
  addBodyInfoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private bodyInfoProvider: BodyInfoProvider,
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
      subCutFatTotal: [null, Validators.required],
      subCutFatTrunk: [null, Validators.required],
      subCutFatArms: [null, Validators.required],
      subCutFatLegs: [null, Validators.required],
      skeletalMuscleTotal: [null, Validators.required],
      skeletalMuscleTrunk: [null, Validators.required],
      skeletalMuscleArms: [null, Validators.required],
      skeletalMuscleLegs: [null, Validators.required]
    });
  }

  /**
   * First attempt to save newBodyInfo in the `userBodyInfo`
   * collection before updating the most recent bodyInfo
   * stored in the individual `user` document.
   *
   * @param newUserBodyInfo
   */
  async _saveToDatabase(newUserBodyInfo: UserBodyInfo) {
    await this.bodyInfoProvider.addBodyInfo(newUserBodyInfo);

    // This is to avoid auto-updating the fitness
    // parameters section even when this modal
    // hasn't been closed yet.
    const userCopy = Object.assign({}, this.user);
    userCopy.bodyInfo = newUserBodyInfo;
    await this.userProvider.updateUser(userCopy);
  }

  save() {
    if (this.addBodyInfoForm.invalid) {
      this._validateAllFormFields(this.addBodyInfoForm);
      this._scrollToTop();
      return;
    }

    const newUserBodyInfo = this._prepareBodyInfo();
    let toast = this.toastCtrl.create({
      message: 'Recording new fitness parameters...',
      position: 'bottom',
    });
    toast.present();

    this._saveToDatabase(newUserBodyInfo)
      .then(() => {
        toast.dismiss();
        this.viewCtrl.dismiss(newUserBodyInfo);
      })
      .catch(error => {
        toast.dismiss();

        toast = this.toastCtrl.create({
          message: error.message || 'Server Error. Try again later',
          position: 'bottom',
          duration: 5000,
        });
        toast.present();
      });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  /**
   * Marks all form fields as touched.
   * Called recursively for FormGroups and FormArrays.
   * Called whenever user attempts to save.
   *
   * @param control
   */
  private _validateAllFormFields(control: AbstractControl) {
    if (control instanceof FormControl)
      control.markAsTouched();
    else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((field: string) => {
        const formGroupControl = control.get(field);
        this._validateAllFormFields(formGroupControl);
      });
    }
  }

  /**
   * Called in the templates to check for input field errors.
   *
   * If the input item is purely a `FormControl` on its own,
   * `formGroupName` and `index` should be null.
   *
   * If the input item belongs to a `FormGroup`, only `index`
   * should be null.
   *
   * If the input item belongs to a `FormGroup` in a
   * `FormArray`, none of the parameters should be left blank.
   *
   * @param formControlName
   */
  getInputError(formControlName: string): string | null {
    if (!formControlName)
      return null;

    let formControl = this.addBodyInfoForm.get(formControlName);
    if (!(formControl.invalid && formControl.touched))
      return null;

    if (formControl.errors) {
      if (formControl.errors.required)
        return '*Required';
    }

    return null;
  }

  /**
   * Scrolls to the top of the page. Called after an attempt
   * to save with invalid details.
   */
  private _scrollToTop() {
    this.content.scrollToTop();
  }

  private _prepareBodyInfo(): UserBodyInfo {
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
      subCutFatTotal: formModel.subCutFatTotal,
      subCutFatTrunk: formModel.subCutFatTrunk,
      subCutFatArms: formModel.subCutFatArms,
      subCutFatLegs: formModel.subCutFatLegs,
      skeletalMuscleTotal: formModel.skeletalMuscleTotal,
      skeletalMuscleTrunk: formModel.skeletalMuscleTrunk,
      skeletalMuscleArms: formModel.skeletalMuscleArms,
      skeletalMuscleLegs: formModel.skeletalMuscleLegs
    };

    return newUserBodyInfo;
  }
}
