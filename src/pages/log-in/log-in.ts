import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';

import { UserProvider } from './../../providers/user/user';
import { HomePage } from './../home/home';
import { SignUpPage } from './../sign-up/sign-up';


/**
 * LogInPage
 *
 * A page showing a form containing the following:
 * - Email field
 * - Password field
 * - Log In button
 *
 * On successful log in, the user gets taken to the HomePage.
 * On error, the user gets shown the error message/s.
 */
@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {
  logInForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.createForm();
  }

  /**
   * Initializes the attribute `logInForm`, a form group containing the
   * form controls for email and password.
   */
  createForm(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]});
  }

  /**
   * Used to make the FormControl `email` visible to the template.
   * @return {FormControl} email
   */
  get email() {
    return this.logInForm.get('email');
  }

  /**
   * Used to make the FormControl `password` visible to the template.
   * @return {FormControl} email
   */
  get password() {
    return this.logInForm.get('password');
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
    if (this.logInForm.errors) return;

    const accountInfo = {
      email: this.logInForm.get('email').value,
      password: this.logInForm.get('password').value
    };

    // Log in in through our User service
    this.userProvider.login(accountInfo)
      .catch((errorObj) => {
        switch (errorObj.code) {
          case 'auth/invalid-email':
            this.logInForm.get('email').setErrors({ email: true });
            break;
          default:
            this.logInForm.setErrors({ serverMessage: errorObj.message });
            break;
        }
      });
  }

  showSignUpForm() {
    this.navCtrl.push(SignUpPage);
  }
}
