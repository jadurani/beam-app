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

  get iceContact(): AbstractControl {
    return this.addUserForm.get('iceContact');
  }

  get firstNameError(): string | null {
    const firstNameControl = this.addUserForm.get('firstName');
    if (!(firstNameControl.invalid && firstNameControl.dirty))
      return null;

    if (firstNameControl.errors.required)
      return 'Required';

    return null;
  }

  get lastNameError(): string | null {
    const lastNameControl = this.addUserForm.get('lastName');
    if (!(lastNameControl.invalid && lastNameControl.dirty))
      return null;

    if (lastNameControl.errors.required)
      return 'Required';

    return null;
  }

  get emailError() {
    const emailControl = this.addUserForm.get('email');
    if (!(emailControl.invalid && emailControl.dirty))
      return null;

    if (emailControl.errors.required)
      return 'Required';

    if (emailControl.errors.email)
      return 'Email format should be <i>juan@delacruz.com</i>.';

    return null;
  }

  get iceContactNameError() {
    const ICENameControl = this.iceContact.get('name');
    if (
      !ICENameControl.invalid ||
      !ICENameControl.dirty
    )
      return null;

    if (ICENameControl.errors.required)
      return 'Required';

    return null;
  }

  get iceContactNumberError() {
    const ICEPhoneNumberControl = this.iceContact.get('phoneNumber');
    if (
      !ICEPhoneNumberControl.invalid ||
      !ICEPhoneNumberControl.dirty
    )
      return null;

    if (ICEPhoneNumberControl.errors.required)
      return 'Required';

    return null;
  }

  createForm(): void {
    this.addUserForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      gender: null,
      dateOfBirth: null,
      email: [null, Validators.required],
      phoneNumbers: this.formBuilder.array([]),
      address: null,
      iceContact: this.formBuilder.control(null),
      otherRemarks: null,
    });

    this._initPhoneNumbersList();
    this._initICE();
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
      (phone: PhoneNumber) => {
        if (phone.number) Object.assign({}, phone);
      },
    );

    if (newNumbers)
      newUser.phoneNumbers = newNumbers;

    if (formModel.iceContact.name && formModel.iceContact.phoneNumber) {
      newUser.iceContact = Object.assign({}, formModel.iceContact);
    }

    return newUser;
  }
}

