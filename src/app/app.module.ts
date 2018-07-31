// Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from "@angular/forms";

// Components
import { MyApp } from './app.component';
import { ContactIceComponent } from './../components/contact-ice/contact-ice';
import { FitnessParametersComponent } from './../components/fitness-parameters/fitness-parameters';
import { FitnessParametersChartViewComponent } from './../components/fitness-parameters-chart-view/fitness-parameters-chart-view';
import { PersonalInfoComponent } from './../components/personal-info/personal-info';
import { SmallSelectComponent } from './../components/small-select/small-select';

// Pages
import { AddEditMemberPage } from '../pages/add-edit-member/add-edit-member';
import { HomePage } from '../pages/home/home';
import { LogInPage } from '../pages/log-in/log-in';
import { ModalAddBodyInfoPage } from '../pages/modal-add-body-info/modal-add-body-info';
import { ModalRiskReleasePage } from '../pages/modal-risk-release/modal-risk-release';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { UserListPage } from '../pages/user-list/user-list';
import { ViewMemberPage } from '../pages/view-member/view-member';

// Native Imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Services / Providers
import { AuthProvider } from '../providers/auth/auth';
import { BodyInfoProvider } from '../providers/body-info/body-info';
import { DateProvider } from '../providers/date/date';
import { UserProvider } from '../providers/user/user';

// Backend Config
import firebase from 'firebase/app';
import { firebaseConfig } from '../environments/environment';
import { FileProvider } from '../providers/file/file';
import { SearchProvider } from '../providers/search/search';
import { DatabaseProvider } from '../providers/database/database';

@NgModule({
  declarations: [
    MyApp,
    ContactIceComponent,
    FitnessParametersComponent,
    FitnessParametersChartViewComponent,
    PersonalInfoComponent,
    SmallSelectComponent,
    AddEditMemberPage,
    HomePage,
    LogInPage,
    ModalAddBodyInfoPage,
    ModalRiskReleasePage,
    SignUpPage,
    UserListPage,
    ViewMemberPage,
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
    AddEditMemberPage,
    HomePage,
    LogInPage,
    ModalAddBodyInfoPage,
    ModalRiskReleasePage,
    SignUpPage,
    UserListPage,
    ViewMemberPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    BodyInfoProvider,
    DateProvider,
    FileProvider,
    UserProvider,
    SearchProvider,
    DatabaseProvider,
  ]
})
export class AppModule {

  constructor() {
    firebase.initializeApp(firebaseConfig.staging);
  }
}
