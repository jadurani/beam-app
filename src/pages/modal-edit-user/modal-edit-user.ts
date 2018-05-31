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

import { DateProvider } from './../../providers/date/date';
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
    private dateProvider: DateProvider,
  ) {
    this.user = this.navParams.get('userToEdit');
    this.createForm(this.user);
  }

  createForm(user: User): void {
    this.editUserForm = this.formBuilder.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : new Date().toISOString(),
      email: user.email,
      phoneNumbers: this.formBuilder.array([]),
      address: user.address,
      iceContact: this.formBuilder.control(null),
      otherRemarks: user.otherRemarks,
    });

    this._buildPhoneNumbersList(user.phoneNumbers);
    this._buildICE(user.iceContact);
  }

  get phoneNumbers(): FormArray {
    return this.editUserForm.get('phoneNumbers') as FormArray;
  }

  get PHONE_TYPES(): Array<string> {
    return ['Home', 'Mobile', 'Work', 'Other'];
  }

  get gender(): AbstractControl {
    return this.editUserForm.get('gender');
  }

  get GENDER_OPTIONS(): Array<string> {
    return ['Male', 'Female', 'Unspecified'];
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

        console.log(error);
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

  private _prepareSaveUser(): void {
    const formModel = this.editUserForm.value;

    this.user.firstName = formModel.firstName;
    this.user.lastName = formModel.lastName;
    this.user.gender = formModel.gender;
    this.user.dateOfBirth = this.dateProvider.stringToDate(formModel.dateOfBirth);
    this.user.email = formModel.email;
    this.user.address = formModel.address;
    this.user.otherRemarks = formModel.otherRemarks;

    this.user.phoneNumbers = formModel.phoneNumbers.map(
      (phone: PhoneNumber) => Object.assign({}, phone),
    );

    if (formModel.iceContact.name && formModel.iceContact.phoneNumber) {
      this.user.iceContact = Object.assign({}, formModel.iceContact);
    }
  }
}
