import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { UserProvider } from './../../providers/user/user';
import { HomePage } from './../home/home';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signUpForm: FormGroup;

  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test12'
  };

  formError: string = '';

  PASSWD_MINLENGTH: number = 8;
  EMAIL_PATTERN: string = '^[a-zA-Z0–9_.+-]+@[a-zA-Z0–9-]+.[a-zA-Z0–9-.]+$';

  constructor(
    public formBuilder: FormBuilder,
    public userProvider: UserProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.createForm();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignUpPage');
  // }

  createForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(this.PASSWD_MINLENGTH)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(this.PASSWD_MINLENGTH)]]
    })
  }

  get email() {
    // console.log(this.signUpForm.get('email').errors);
    return this.signUpForm.get('email');
  }

  onSubmit() {
    console.log('meow -- im supposed to validate the form here');
    console.log(this.signUpForm);
  }
  doSignup() {
    // Attempt to login in through our User service
    this.userProvider.signup(this.account)
    .then((resp) => {
      this.navCtrl.setRoot(HomePage);
      console.log(resp);
      console.log('resolved back here at doSignUp');
    }, (err) => {
      this.formError = err;
      console.log(err);
      console.log('rejected back here at doSignUp');

      // this.navCtrl.push(MainPage);

      // Unable to sign up
      // let toast = this.toastCtrl.create({
      //   message: this.signupErrorString,
      //   duration: 3000,
      //   position: 'top'
      // });
      // toast.present();
    });
  }

}
