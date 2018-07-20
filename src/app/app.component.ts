// Modules
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Components
import { HomePage } from '../pages/home/home';
import { UserListPage } from '../pages/user-list/user-list';
import { LogInPage } from '../pages/log-in/log-in';

// Providers
import { AuthProvider } from './../providers/auth/auth';
import { UserProvider } from './../providers/user/user';

// Backend
import firebase from 'firebase/app';
import 'firebase/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Users', component: UserListPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    firebase.auth().onAuthStateChanged(user => {
      this.userProvider.setCurrentUser();
      if (user) {
        this.rootPage = UserListPage;
      } else {
        this.rootPage = LogInPage;
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  isLoggedIn() {
    return this.userProvider.getCurrentUser();
  }

  signOut() {
    this.authProvider.signOut();
  }
}
