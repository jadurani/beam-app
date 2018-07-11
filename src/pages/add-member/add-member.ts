import { Component } from '@angular/core';
import {
  IonicPage,
  ToastController,
  ModalController
} from 'ionic-angular';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { DateProvider } from './../../providers/date/date';
import { UserProvider } from '../../providers/user/user';

import {
  PhoneNumber,
  User
} from './../../models/user-model';

import {
  ModalRiskReleasePage
} from '../modal-risk-release/modal-risk-release';


@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {
  addMemberForm: FormGroup;

  constructor(
    private dateProvider: DateProvider,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private userProvider: UserProvider
  ) {
    this.createAddMemberForm();
  }

  createAddMemberForm() {
    this.addMemberForm = this.formBuilder.group({
      address: this.formBuilder.control(null),
      dateOfBirth: [null, Validators.required],
      email: [null, Validators.required],
      fullName: [null, Validators.required],
      iceContact: this.formBuilder.control(null),
      nickname: [null, Validators.required],
      otherRemarks: null,
      phoneNumbers: this.formBuilder.array([]),
      prefix: [null, Validators.required],
      sex: [null, Validators.required],
      signedRelease: [false, Validators.requiredTrue],
      socialMedia: null,
    });

    this._buildAddressFormControl();
    this._buildICEContactFormControl();
    this._buildPhoneNumbersFormArray();
  }

  private _buildAddressFormControl() {
    const addressFormGroup = this.formBuilder.group({
      street: null,
      barangay: null,
      city: [null, Validators.required],
    });

    this.addMemberForm.setControl('address', addressFormGroup);
  }

  private _buildICEContactFormControl() {
    const iceContactFormGroup = this.formBuilder.group({
      name: [null, Validators.required],
      relationship: [null, Validators.required],
      contactNumber: [null, Validators.required],
      email: null,
      socialMedia: null,
    });

    this.addMemberForm.setControl('iceContact', iceContactFormGroup);
  }

  private _buildPhoneNumbersFormArray() {
    const phoneNumbers = [{
      number: null,
      label: null,
    }];

    const phoneNumbersFormGroup = phoneNumbers.map(
      phone => this.formBuilder.group(phone)
    );
    const phoneNumbersFormArray =
      this.formBuilder.array(phoneNumbersFormGroup);
    this.addMemberForm.setControl('phoneNumbers', phoneNumbersFormArray);
  }

  private _prepareNewMember(): User {
    const formModel = this.addMemberForm.value;

    const newUser: User = {
      dateJoined: this.dateProvider.dateNow(),
      roles: {client: true},
    };

    newUser.displayName = formModel.nickname;
    newUser.email = formModel.email;
    newUser.fullName = formModel.fullName;
    newUser.prefix = formModel.prefix;
    newUser.sex = formModel.sex;
    newUser.dateOfBirth =
      this.dateProvider.stringToDate(formModel.dateOfBirth);


    if (formModel.socialMedia)
      newUser.socialMedia = formModel.socialMedia;
    if (formModel.otherRemarks)
      newUser.otherRemarks = formModel.otherRemarks;

    const newNumbers = formModel.phoneNumbers
      .filter(
        (phone: PhoneNumber) => phone.number,
      )
      .map(
        (phone: PhoneNumber) => Object.assign({}, phone),
      );

    if (newNumbers)
      newUser.phoneNumbers = newNumbers;

    newUser.iceContact = Object.assign({}, formModel.iceContact);
    newUser.address = Object.assign({}, formModel.address);

    return newUser;
  }

  save() {
    if (this.addMemberForm.invalid) return null;

    const newUser = this._prepareNewMember();

    let toast = this.toastCtrl.create({
      message: 'Adding new user...',
      position: 'bottom',
    });
    toast.present();

    this.userProvider.addUser(newUser)
      .then(userId => {
        toast.dismiss();
        newUser.id = userId;
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

  openModalRiskRelease() {
    const riskReleaseModal = this.modalCtrl.create(ModalRiskReleasePage);
    riskReleaseModal.present();
  }

  getInputError(formControlName: string, formGroupName?: string): string | null {
    if (!formControlName)
      return null;

    let formControl;
    if (formGroupName) {
      formControl = this.addMemberForm.get(formGroupName).get(formControlName);
    } else {
      formControl = this.addMemberForm.get(formControlName);
    }

    if (!(formControl.invalid && formControl.dirty))
      return null;

    if (formControl.errors.required)
      return 'Required';

    return null;
  }

  get phoneNumbers(): FormArray {
    return this.addMemberForm.get('phoneNumbers') as FormArray;
  }
}
