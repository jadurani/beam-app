// Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from "@angular/forms";

// Components
import { MyApp } from './app.component';
import { SmallSelectComponent } from './../components/small-select/small-select';

// Pages
import { AddMemberPage } from '../pages/add-member/add-member';
import { HomePage } from '../pages/home/home';
import { LogInPage } from '../pages/log-in/log-in';
import { ModalAddBodyInfoPage } from '../pages/modal-add-body-info/modal-add-body-info';
import { ModalAddUserPage } from '../pages/modal-add-user/modal-add-user';
import { ModalEditUserPage } from '../pages/modal-edit-user/modal-edit-user';
import { ModalRiskReleasePage } from '../pages/modal-risk-release/modal-risk-release';
import { ModalUserDetailsPage } from '../pages/modal-user-details/modal-user-details';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { UserListPage } from '../pages/user-list/user-list';

// Native Imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Services / Providers
import { AuthProvider } from '../providers/auth/auth';
import { DateProvider } from '../providers/date/date';
import { UserProvider } from '../providers/user/user';

// Backend Config
import * as firebase from 'firebase';
import { firebaseConfig } from '../environments/environment';

@NgModule({
  declarations: [
    MyApp,
    SmallSelectComponent,
    AddMemberPage,
    HomePage,
    LogInPage,
    ModalAddBodyInfoPage,
    ModalAddUserPage,
    ModalEditUserPage,
    ModalRiskReleasePage,
    ModalUserDetailsPage,
    SignUpPage,
    UserListPage,
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
    AddMemberPage,
    HomePage,
    LogInPage,
    ModalAddBodyInfoPage,
    ModalAddUserPage,
    ModalEditUserPage,
    ModalRiskReleasePage,
    ModalUserDetailsPage,
    SignUpPage,
    UserListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    AuthProvider,
    DateProvider
  ]
})
export class AppModule {

  constructor() {
    firebase.initializeApp(firebaseConfig.staging);
  }
}
