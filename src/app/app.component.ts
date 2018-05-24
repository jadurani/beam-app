import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { UserListPage } from '../pages/user-list/user-list';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { LogInPage } from '../pages/log-in/log-in';

import { firebaseConfig } from '../environments/environment';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Dashboard', component: DashboardPage },
      { title: 'List', component: ListPage },
      { title: 'User', component: UserListPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    firebase.initializeApp(firebaseConfig.staging);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.rootPage = HomePage;
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

  signOut() {
    firebase.auth().signOut();
  }
}
