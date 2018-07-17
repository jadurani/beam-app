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
  NavParams,
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
 * Page to add a new member or edit details of
 * existing member.
 */

@IonicPage()
@Component({
  selector: 'page-add-edit-member',
  templateUrl: 'add-edit-member.html',
})
export class AddEditMemberPage {
  @ViewChild(Content) content: Content;
  userInfoForm: FormGroup;
  isEdit: boolean = false;
  partToEdit: string;
  pendingUser: User;

  constructor(
    private dateProvider: DateProvider,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private userProvider: UserProvider
  ) {
    this.isEdit = this.navParams.get('isEdit');
    this.partToEdit = this.navParams.get('partToEdit') || '';
    if (this.isEdit) {
      this.pendingUser = this.navParams.get('user');
      switch (this.partToEdit) {
        case 'basicInfo':
          this.editBasicInfoFormInit();
          break;

        case 'iceContact':
          this.editICEContactFormInit();
          break;
      }
    } else {
      this.createNewUserInfoForm();
    }
  }

  /**
   * Initializes `userInfoForm`.
   */
  createNewUserInfoForm() {
    this.userInfoForm = this.formBuilder.group({
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
      workDetails: this.formBuilder.group({
        title: null,
        company: null,
      }),
    });

    this._buildAddressFormGroup();
    this._buildICEContactFormGroup();
    this._buildPhoneNumbersFormArray();
  }

  editBasicInfoFormInit() {
    this.userInfoForm = this.formBuilder.group({
      address: this.formBuilder.control(null),
      dateOfBirth: [this.pendingUser.dateOfBirth.toISOString(), Validators.required],
      email: [this.pendingUser.email, Validators.required],
      fullName: [this.pendingUser.fullName, Validators.required],
      iceContact: this.formBuilder.control(null),
      nickname: [this.pendingUser.displayName, Validators.required],
      otherRemarks: this.pendingUser.otherRemarks,
      phoneNumbers: this.formBuilder.array([]),
      prefix: [this.pendingUser.prefix, Validators.required],
      sex: [this.pendingUser.sex, Validators.required],
      socialMedia: this.pendingUser.socialMedia,
      workDetails: this.formBuilder.group({
        title: null,
        company: null,
      }),
    });

    if (this.pendingUser.workDetails) {
      this.userInfoForm.setControl('workDetails', this.formBuilder.group({
        title: this.pendingUser.workDetails.title,
        company: this.pendingUser.workDetails.company,
      }));
    }

    this._buildAddressFormGroup();
    this._buildPhoneNumbersFormArray();
  }

  editICEContactFormInit() {
    this.userInfoForm = this.formBuilder.group({
      iceContact: this.formBuilder.control(null),
    });

    this._buildICEContactFormGroup();
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

    if (this.isEdit && this.pendingUser && this.pendingUser.address) {
      addressFormGroup.get('street').setValue(this.pendingUser.address.street);
      addressFormGroup.get('barangay').setValue(this.pendingUser.address.barangay);
      addressFormGroup.get('city').setValue(this.pendingUser.address.city);
    }

    this.userInfoForm.setControl('address', addressFormGroup);
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

    if (this.isEdit && this.pendingUser && this.pendingUser.iceContact) {
      iceContactFormGroup.get('name').setValue(this.pendingUser.iceContact.name);
      iceContactFormGroup.get('relationship').setValue(this.pendingUser.iceContact.relationship);
      iceContactFormGroup.get('contactNumber').setValue(this.pendingUser.iceContact.contactNumber);
      iceContactFormGroup.get('email').setValue(this.pendingUser.iceContact.email);
      iceContactFormGroup.get('socialMedia').setValue(this.pendingUser.iceContact.socialMedia);
    }

    this.userInfoForm.setControl('iceContact', iceContactFormGroup);
  }

  /**
   * Initializes the PhoneNumbers PhoneArray
   */
  private _buildPhoneNumbersFormArray() {
    let phoneNumbers = [];
    if (this.isEdit && this.pendingUser) {
      this.pendingUser.phoneNumbers.forEach(phoneNumber => {
        phoneNumbers.push({
          number: new FormControl(phoneNumber.number, Validators.required),
          label: new FormControl(phoneNumber.label),
        });
      });
    } else {
      phoneNumbers.push({
        number: new FormControl(null, Validators.required),
        label: new FormControl(),
      });
    }

    const phoneNumbersFormGroup = phoneNumbers.map(
      phone => this.formBuilder.group(phone)
    );

    const phoneNumbersFormArray =
      this.formBuilder.array(phoneNumbersFormGroup);
    this.userInfoForm.setControl('phoneNumbers', phoneNumbersFormArray);
  }

  /**
   * Initializes a User object with the values from `userInfoForm`.
   *
   * @returns The User object ready to be passed onto the database
   */
  private _prepareUserInfo(): User {
    const formModel = this.userInfoForm.value;
    let userObj: User;

    if (!this.isEdit) {
      userObj = {
        dateJoined: this.dateProvider.dateNow(),
        roles: {client: true},
      };
    } else {
      userObj = {
        dateJoined: this.pendingUser.dateJoined,
        roles: this.pendingUser.roles,
      };
    }

    if (!this.isEdit || (this.isEdit && this.partToEdit === 'basicInfo')) {
      userObj.displayName = formModel.nickname;
      userObj.email = formModel.email;
      userObj.fullName = formModel.fullName;
      userObj.prefix = formModel.prefix;
      userObj.sex = formModel.sex;
      userObj.dateOfBirth =
      this.dateProvider.stringToDate(formModel.dateOfBirth);

      if (formModel.socialMedia)
      userObj.socialMedia = formModel.socialMedia;
      if (formModel.otherRemarks)
      userObj.otherRemarks = formModel.otherRemarks;

      const newNumbers = formModel.phoneNumbers
      .filter(
        (phone: PhoneNumber) => phone.number,
      )
      .map(
        (phone: PhoneNumber) => Object.assign({}, phone),
      );

      if (newNumbers)
        userObj.phoneNumbers = newNumbers;

      userObj.address = Object.assign({}, formModel.address);
    }

    if (!this.isEdit || (this.isEdit && this.partToEdit === 'iceContact')) {
      userObj.iceContact = Object.assign({}, formModel.iceContact);
    }

    return userObj;
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
    if (this.userInfoForm.invalid) {
      this._validateAllFormFields(this.userInfoForm);
      this._scrollToTop();
      return null;
    }

    const userToSave = this._prepareUserInfo();

    let toastMsg = this.isEdit ? 'Saving changes...' : 'Adding new user...';

    let toast = this.toastCtrl.create({
      message: toastMsg,
      position: 'bottom',
    });
    toast.present();

    if (this.isEdit) {
      userToSave.id = this.pendingUser.id;

      this.userProvider.updateUser(userToSave)
        .then(updatedUser => {
          toast.dismiss();
          this.navCtrl.pop(updatedUser);
        })
        .catch(error => {
          toast.dismiss();

          console.log(error.message);
          toast = this.toastCtrl.create({
            message: error.message || 'Server Error. Try again later',
            position: 'bottom',
            duration: 3000,
          });
          toast.present();
        });
    } else {
      this.userProvider.addUser(userToSave)
        .then(userId => {
          toast.dismiss();
          userToSave.id = userId;
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
  }

  /**
   * Clicking the Risk Release card in the form opens this
   * modal containing the terms and conditions that the user
   * must first agree on.
   *
   * User can't directly mark the checkbox on `userInfoForm`
   * (`userInfoForm.signedRelease`) but ticking the checkbox
   * in `modalRiskRelease` would tick also the one in
   * `userInfoForm`. In other words, the value of
   * `userInfoForm.signedRelease` depends on
   * `modalRiskRelease`'s checkbox value (`signed`).
   */
  openModalRiskRelease() {
    const riskReleaseModal = this.modalCtrl.create(
      ModalRiskReleasePage,
      {'signedRelease': this.signedRelease.value}
    );

    riskReleaseModal.onDidDismiss((signed: boolean) => {
      this.userInfoForm.get('signedRelease').setValue(signed);
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
        const formArray = this.userInfoForm.get(formGroupName) as FormArray;
        formControl = formArray.controls[index].get(formControlName);
      } else {
        formControl = this.userInfoForm.get(formGroupName).get(formControlName);
      }
    } else {
      formControl = this.userInfoForm.get(formControlName);
    }

    if (!(formControl.invalid && formControl.touched))
      return null;

    if (formControl.errors && formControl.errors.required)
      return '*Required';

    return null;
  }

  get phoneNumbers(): FormArray {
    return this.userInfoForm.get('phoneNumbers') as FormArray;
  }

  get signedRelease(): AbstractControl {
    return this.userInfoForm.get('signedRelease');
  }
}
