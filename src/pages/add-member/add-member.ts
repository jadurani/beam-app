import {
  Component,
  ViewChild,
} from '@angular/core';
import {
  Content,
  IonicPage,
  ToastController,
  NavController,
  ModalController,
} from 'ionic-angular';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
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


/**
 * Sign up form for new members.
 */

@IonicPage()
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {
  @ViewChild(Content) content: Content;
  addMemberForm: FormGroup;

  constructor(
    private dateProvider: DateProvider,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private userProvider: UserProvider
  ) {
    this.createAddMemberForm();
  }

  /**
   * Initializes `addMemberForm`.
   */
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

    this._buildAddressFormGroup();
    this._buildICEContactFormGroup();
    this._buildPhoneNumbersFormArray();
  }

  /**
   * Initializes the Address FormGroup
   */
  private _buildAddressFormGroup() {
    const addressFormGroup = this.formBuilder.group({
      street: null,
      barangay: null,
      city: [null, Validators.required],
    });

    this.addMemberForm.setControl('address', addressFormGroup);
  }

  /**
   * Initializes the ICEContact FormGroup
   */
  private _buildICEContactFormGroup() {
    const iceContactFormGroup = this.formBuilder.group({
      name: [null, Validators.required],
      relationship: [null, Validators.required],
      contactNumber: [null, Validators.required],
      email: null,
      socialMedia: null,
    });

    this.addMemberForm.setControl('iceContact', iceContactFormGroup);
  }

  /**
   * Initializes the PhoneNumbers PhoneArray
   */
  private _buildPhoneNumbersFormArray() {
    const phoneNumbers = [{
      number: new FormControl(null, Validators.required),
      label: new FormControl(),
    }];

    const phoneNumbersFormGroup = phoneNumbers.map(
      phone => this.formBuilder.group(phone)
    );
    const phoneNumbersFormArray =
      this.formBuilder.array(phoneNumbersFormGroup);
    this.addMemberForm.setControl('phoneNumbers', phoneNumbersFormArray);
  }

  /**
   * Initializes a User object with the values from `addMemberForm`.
   *
   * @returns The User object ready to be passed onto the database
   */
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

  /**
   * Scrolls to the top of the page. Called after an attempt
   * to save with invalid details.
   */
  private _scrollToTop() {
    this.content.scrollToTop();
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
    } else if (control instanceof FormArray) {
      const controlAsFormArray = control as FormArray;
      controlAsFormArray.controls.forEach(
        (arrayControl: AbstractControl) => this._validateAllFormFields(arrayControl)
      );
    }
  }

  /**
   * Validates the form.
   * If the form is valid, a toaster is presented at the bottom
   * informing the user that the request to add a new member is
   * currently being processed and they need to chill.
   *
   * If an error occurs on this attempt, they'd be informed of
   * such error.  However if the save attempt's a success, they'd
   * be taken back to the UserList page.
   *
   * TO DO: On successful save, instead of taking the user back to
   * the UserList page, take them to the profile page of the
   * newly-created user.
   */
  save() {
    if (this.addMemberForm.invalid) {
      this._validateAllFormFields(this.addMemberForm);
      this._scrollToTop();
      return null;
    }

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
        this.navCtrl.pop();
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

  /**
   * Clicking the Risk Release card in the form opens this
   * modal containing the terms and conditions that the user
   * must first agree on.
   *
   * User can't directly mark the checkbox on `addMemberForm`
   * (`addMemberForm.signedRelease`) but ticking the checkbox
   * in `modalRiskRelease` would tick also the one in
   * `addMemberForm`. In other words, the value of
   * `addMemberForm.signedRelease` depends on
   * `modalRiskRelease`'s checkbox value (`signed`).
   */
  openModalRiskRelease() {
    const riskReleaseModal = this.modalCtrl.create(
      ModalRiskReleasePage,
      {'signedRelease': this.signedRelease.value}
    );

    riskReleaseModal.onDidDismiss((signed: boolean) => {
      this.addMemberForm.get('signedRelease').setValue(signed);
    });

    riskReleaseModal.present();
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
   * @param formGroupName
   * @param index
   */
  getInputError(
    formControlName: string,
    formGroupName?: string,
    index ?: number): string | null
  {
    if (!formControlName)
      return null;

    let formControl;
    if (formGroupName) {
      if (index !== null && index !== undefined) {
        const formArray = this.addMemberForm.get(formGroupName) as FormArray;
        formControl = formArray.controls[index].get(formControlName);
      } else {
        formControl = this.addMemberForm.get(formGroupName).get(formControlName);
      }
    } else {
      formControl = this.addMemberForm.get(formControlName);
    }

    if (!(formControl.invalid && formControl.touched))
      return null;

    if (formControl.errors && formControl.errors.required)
      return '*Required';

    return null;
  }

  get phoneNumbers(): FormArray {
    return this.addMemberForm.get('phoneNumbers') as FormArray;
  }

  get signedRelease(): AbstractControl {
    return this.addMemberForm.get('signedRelease');
  }
}
