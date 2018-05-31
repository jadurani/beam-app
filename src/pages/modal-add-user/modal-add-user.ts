import { Component } from '@angular/core';
import {
  IonicPage,
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
import { User, PhoneNumber } from './../../models/user-model';

import { UserProvider } from '../../providers/user/user';

/**
 * Modal to edit user info.
 */
@IonicPage()
@Component({
  selector: 'page-modal-add-user',
  templateUrl: 'modal-add-user.html',
})
export class ModalAddUserPage {
  addUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private userProvider: UserProvider,
    private dateProvider: DateProvider,
  ) {

    this.createForm();
  }

  createForm(): void {
    this.addUserForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      gender: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      email: [null, Validators.required],
      phoneNumbers: this.formBuilder.array([]),
      address: [null, Validators.required],
      iceContact: this.formBuilder.control(null),
      otherRemarks: null,
    });

    this._initPhoneNumbersList();
    this._initICE();
  }

  get phoneNumbers(): FormArray {
    return this.addUserForm.get('phoneNumbers') as FormArray;
  }

  get PHONE_TYPES(): Array<string> {
    return ['Home', 'Mobile', 'Work', 'Other'];
  }

  get gender(): AbstractControl {
    return this.addUserForm.get('gender');
  }

  get GENDER_OPTIONS(): Array<string> {
    return ['Male', 'Female', 'Unspecified'];
  }

  private _initPhoneNumbersList(): void {
    const phoneNumbers = [{
      number: '',
      type: '',
    }];

    const phoneFGs = phoneNumbers.map(phone => this.formBuilder.group(phone));
    const phoneFormArray = this.formBuilder.array(phoneFGs);
    this.addUserForm.setControl('phoneNumbers', phoneFormArray);
  }

  private _initICE(): void {
    const iceContactFG = this.formBuilder.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
    });

    this.addUserForm.setControl('iceContact', iceContactFG);
  }

  onSelect(control: FormControl, value: string) {
    control.setValue(value);
    this.addUserForm.markAsDirty();
  }

  save() {
    if (this.addUserForm.invalid) return;

    const newUser = this._prepareSaveUser();

    let toast = this.toastCtrl.create({
      message: 'Adding new user...',
      position: 'bottom',
    });
    toast.present();

    this.userProvider.addUser(newUser)
      .then(userId => {
        toast.dismiss();
        newUser.id = userId;
        this.viewCtrl.dismiss(newUser);
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

  private _prepareSaveUser(): User {
    const formModel = this.addUserForm.value;

    // without ID -- will be set after successful creation
    const newUser: User = {
      dateJoined: this.dateProvider.dateNow(),
      roles: {client: true},
    };

    if (formModel.firstName)
      newUser.firstName = formModel.firstName;
    if (formModel.lastName)
      newUser.lastName = formModel.lastName;
    if (formModel.gender)
      newUser.gender = formModel.gender;

    if (formModel.dateOfBirth)
      newUser.dateOfBirth = this.dateProvider.stringToDate(formModel.dateOfBirth);

    if (formModel.email)
      newUser.email = formModel.email;
    if (formModel.address)
      newUser.address = formModel.address;
    if (formModel.otherRemarks)
      newUser.otherRemarks = formModel.otherRemarks;

    const newNumbers = formModel.phoneNumbers.map(
      (phone: PhoneNumber) => Object.assign({}, phone),
    );

    if (newNumbers)
      newUser.phoneNumbers = newNumbers;

    if (formModel.iceContact.name && formModel.iceContact.phoneNumber) {
      newUser.iceContact = Object.assign({}, formModel.iceContact);
    }

    return newUser;
  }
}

