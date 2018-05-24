import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

/**
 * AuthProvider
 *
 * Handles all authentication code my all modules in the app.
 * Communicates directly with firebase.
 */
@Injectable()
export class AuthProvider {

  constructor() {}

  signup(accountInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().createUserWithEmailAndPassword(accountInfo.email, accountInfo.password)
            .then(() => resolve())
            .catch(errorObj => reject(errorObj));
        })
        .catch(errorObj => reject(errorObj));
    });
  }

  login(accountInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithEmailAndPassword(accountInfo.email, accountInfo.password)
            .then(() => resolve())
            .catch(errorObj => reject(errorObj));
        })
        .catch(errorObj => reject(errorObj));
    });
  }

  signOut() {
    firebase.auth().signOut();
  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }
}
