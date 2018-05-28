import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User, ICEContact, PhoneNumber } from './../../models/user-model';
// import { UserProvider } from '../../providers/user/user';

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
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {

    this.user = this.navParams.get('user');
    this.createForm(this.user);
  }

  createForm(user: User): void {
    this.editUserForm = this.formBuilder.group({
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.displayName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      phoneNumbers: this.formBuilder.array([]),
      address: user.address,
      iceContact: this.formBuilder.control(null),
      otherRemarks: user.otherRemarks,
    });

    this._buildPhoneNumbersList(user.phoneNumbers);
    this._buildICE(user.iceContact);
  }

  private _buildICE(contact: ICEContact | null): void {
    if (!contact) {
      contact = {
        name: '',
        phoneNumber: '',
      };
    }

    const iceContactFG = this.formBuilder.group(contact);
    this.editUserForm.setControl('iceContact', iceContactFG);
  }
  private _buildPhoneNumbersList(phoneNumbers: PhoneNumber[]) {
    const phoneFGs = phoneNumbers.map(phone => this.formBuilder.group(phone));
    const phoneFormArray = this.formBuilder.array(phoneFGs);
    this.editUserForm.setControl('phoneNumbers', phoneFormArray);
  }

  get phoneNumbers(): FormArray {
    return this.editUserForm.get('phoneNumbers') as FormArray;
  }

  // add phone number
  // remove phone number

  closeModal() {
    console.log(this.editUserForm.value);
    this.viewCtrl.dismiss();
  }
}
