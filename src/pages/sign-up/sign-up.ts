import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';

import { UserProvider } from './../../providers/user/user';
import { HomePage } from './../home/home';

/**
 * SignUpPage
 *
 * A page showing a form containing the following:
 * - Email field
 * - Password field
 * - Confirm Password field
 * - Sign Up button
 *
 * On successful sign up, the user gets taken to the HomePage.
 * On error, the user gets shown the error message/s.
 */
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signUpForm: FormGroup;
  PASSWD_MINLENGTH: number = 8;

  constructor(
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.createForm();
  }

  /**
   * Initializes the attribute `signUpForm`, a form group containing the
   * form controls for email, password, and confirmPassword.
   */
  createForm(): void {
    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.PASSWD_MINLENGTH)
          ]
        ],
      confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(this.PASSWD_MINLENGTH),
          ]
        ]
      }, {validator: this.passwordMatch});
  }

  /**
   * Used to make the FormControl `email` visible to the template.
   * @return {FormControl} email
   */
  get email() {
    return this.signUpForm.get('email');
  }

  /**
   * Used to make the FormControl `password` visible to the template.
   * @return {FormControl} email
   */
  get password() {
    return this.signUpForm.get('password');
  }

  /**
   * Used to make the FormControl `confirmPassword` visible to the template.
   * @return {FormControl} email
   */
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  /**
   * Sends a request to UserProvider to create a user
   * based on the email and password credentials entered
   * by the user.
   *
   * On success, the user gets taken to the HomePage.
   * On error, the user gets shown the error message/s.
   */
  onSubmit(): void {
    if (this.signUpForm.errors) return;

    const accountInfo = {
      email: this.signUpForm.get('email').value,
      password: this.signUpForm.get('password').value
    };

    // Login in through our User service
    this.userProvider.signup(accountInfo)
    .then(() => {
      this.navCtrl.setRoot(HomePage);
    }, (errorObj) => {
      console.log(errorObj);
      switch (errorObj.code) {
        case 'auth/invalid-email':
          this.signUpForm.get('email').setErrors({email: true});
          break;
        default:
          this.signUpForm.setErrors({ serverMessage: errorObj.message });
          break;
      }
    });
  }

  /**
   * Checks if the password and confirmPassword fields in the signUpForm
   * do match values.
   * @param {AbstractControl} control The signUpForm
   * @returns null | {Object}
   */
  private passwordMatch(formGroup: AbstractControl) {
    const passwordValue = formGroup.get('password').value;
    const confirmPasswordValue = formGroup.get('confirmPassword').value;

    if (!passwordValue || !confirmPasswordValue) {
      return null;
    }

    const exactMatch = passwordValue === confirmPasswordValue;
    return exactMatch ? null : {passwordMismatch: true};
  }
}
