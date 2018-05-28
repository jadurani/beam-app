import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from "@angular/forms";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { UserListPage } from '../pages/user-list/user-list';
import { ModalUserDetailsPage } from '../pages/modal-user-details/modal-user-details';
import { ModalEditUserPage } from '../pages/modal-edit-user/modal-edit-user';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LogInPage } from '../pages/log-in/log-in';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../providers/user/user';
import { AuthProvider } from '../providers/auth/auth';

// Backend Config
import * as firebase from 'firebase';
import { firebaseConfig } from '../environments/environment';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    UserListPage,
    ModalUserDetailsPage,
    ModalEditUserPage,
    SignUpPage,
    LogInPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    UserListPage,
    ModalUserDetailsPage,
    ModalEditUserPage,
    SignUpPage,
    LogInPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AuthProvider
  ]
})
export class AppModule {

  constructor() {
    firebase.initializeApp(firebaseConfig.staging);
  }
}
