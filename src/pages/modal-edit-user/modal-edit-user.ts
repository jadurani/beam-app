import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { User, ICEContact, PhoneNumber } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';

/**
 * Modal to edit user info.
 */
@IonicPage()
@Component({
  selector: 'page-modal-edit-user',
  templateUrl: 'modal-edit-user.html',
})
export class ModalEditUserPage {
  editUserForm: FormGroup;
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private userProvider: UserProvider,
  ) {
    this.user = this.navParams.get('userToEdit');
    this.createForm(this.user);
  }

  createForm(user: User): void {
    this.editUserForm = this.formBuilder.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      nickName: user.displayName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : new Date().toISOString(),
      email: user.email,
      phoneNumbers: this.formBuilder.array([]),
      address: user.address,
      iceContact: this.formBuilder.control(null),
      otherRemarks: user.otherRemarks,
      bodyInfo: this.initBodyInfo(),
    });

    this._buildPhoneNumbersList(user.phoneNumbers);
    this._buildICE(user.iceContact);
    this.initBodyInfo();
  }

  get phoneNumbers(): FormArray {
    return this.editUserForm.get('phoneNumbers') as FormArray;
  }

  get gender(): AbstractControl {
    return this.editUserForm.get('gender');
  }

  get GENDER_OPTIONS(): Array<string> {
    return ['Male', 'Female', 'Unspecified'];
  }

  get PHONE_TYPES(): Array<string> {
    return ['Home', 'Mobile', 'Work', 'Other'];
  }

  onSelect(control: FormControl, value: string) {
    control.setValue(value);
    this.editUserForm.markAsDirty();
  }

  save() {
    if (this.editUserForm.invalid) return;

    this._prepareSaveUser();
    let toast = this.toastCtrl.create({
      message: 'Saving changes...',
      position: 'bottom',
    });
    toast.present();

    this.userProvider.updateUser(this.user)
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

  private _buildICE(contact: ICEContact | null): void {
    if (!contact) {
      contact = {
        name: null,
        phoneNumber: null,
      };
    }

    const iceContactFG = this.formBuilder.group(contact);
    this.editUserForm.setControl('iceContact', iceContactFG);
  }

  private _buildPhoneNumbersList(phoneNumbers: PhoneNumber[]) {
    if (!phoneNumbers) {
      phoneNumbers = [{
        number: '',
        type: '',
      }];
    };

    const phoneFGs = phoneNumbers.map(phone => this.formBuilder.group(phone));
    const phoneFormArray = this.formBuilder.array(phoneFGs);
    this.editUserForm.setControl('phoneNumbers', phoneFormArray);
  }

  private initBodyInfo() {
    const dateToday = new Date();
    return this.formBuilder.group({
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

  private _prepareSaveUser(): void {
    const formModel = this.editUserForm.value;

    this.user.setFirstName(formModel.firstName);
    this.user.setLastName(formModel.lastName);
    // this.user.setDisplayName(formModel.displayName);
    this.user.setGender(formModel.gender);
    this.user.setDateOfBirth(formModel.dateOfBirth);

    this.user.setEmail(formModel.email);
    this.user.setPhoneNumbers(formModel.phoneNumbers);

    this.user.setAddress(formModel.address);
    if (!formModel.iceContact.name && !formModel.iceContact.phoneNumber) {
      this.user.setICE(formModel.iceContact);
    }

    this.user.setOtherRemarks(formModel.otherRemarks);

    this.user.setFitnessParams(formModel.bodyInfo);
  }
}
