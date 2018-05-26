import { Injectable } from '@angular/core';
import { User, UserBodyInfo } from './../../models/user-model';

import { AuthProvider } from './../../providers/auth/auth';
import * as firebase from 'firebase';


/**
 * UserProvider
 *
 * @method getUsers
 * @method getUserById
 */
@Injectable()
export class UserProvider {
  db: any;
  currentUser: User;
  usersList : User[];
  COLLECTION: string = 'users';

  constructor(public authProvider: AuthProvider) {
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true,
    });
  }

  /**
   * @method UserProvider.setCurrentUser
   * @description
   * Sets the current user as an instance of User, by also
   * using the attributes of firebase.User
   */
  setCurrentUser() {
    let authCurrentUser = this.authProvider.getCurrentUser();
    this.db.collection(this.COLLECTION)
      .where('authId', '==', authCurrentUser.uid)
      .get()
      .then((querySnapshot) => {
        let userObj;

        querySnapshot.forEach(doc => {
          userObj = JSON.parse(JSON.stringify(doc.data()))
          userObj.id = doc.id;
        });

        userObj.displayName = authCurrentUser.displayName;
        userObj.email = authCurrentUser.email;
        userObj.phoneNumber = authCurrentUser.phoneNumber;
        userObj.photoUrl = authCurrentUser.photoURL;

        this.currentUser = this._getUser(userObj);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  /**
   * @method UserProvider.getCurrentUser
   * @description
   * setCurrentUser must always be called at the root component.
   * Only then can this function getCurrentUser be called anywhere
   * else in the app.
   *
   * @returns The current logged in user
   */
  getCurrentUser(): User {
    return this.currentUser;
  }

  getUsers(useCache = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if (useCache && this.usersList){
        resolve(this.usersList);
        return;
      }

      this.db.collection(this.COLLECTION)
        .get()
        .then(querySnapshot => {
          let usersArray = [];

          querySnapshot.forEach(doc => {
            var userObj = JSON.parse(JSON.stringify(doc.data()));
            userObj.id = doc.id;
            const user = this._getUser(userObj);
            usersArray.push(user);
          });

          this.usersList = usersArray;
          resolve(this.usersList);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  getUserById(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.COLLECTION)
        .doc(userId)
        .get()
        .then(doc => {
          var userObj = JSON.parse(JSON.stringify(doc.data()));
          userObj.id = doc.id;
          let user = this._getUser(userObj, true)
          resolve(user);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  // updateUser() {}

  // addUser() {}

  // deactivateUser() {}

  // activateUser() {}

  // searchUsers() {}

  // private log(message: string) {}

  private _getUser(
    userObj: any,
    getBodyInfo: boolean = false,
  ) {
    const user = new User(userObj.id, userObj.dateJoined, userObj.roles);

    user.setFirebaseAuthInfo(
      userObj.authId ? userObj.authId : null,
      userObj.displayName ? userObj.displayName : null,
      userObj.email ? userObj.email : null,
      userObj.phoneNumber ? userObj.phoneNumber : null,
      userObj.photoUrl ? userObj.photoUrl : null
    );

    user.setBasicInfo(
      userObj.firstName ? userObj.firstName : null,
      userObj.lastName ? userObj.lastName : null,
      userObj.suffix ? userObj.suffix : null,
      userObj.gender ? userObj.gender : null,
      userObj.dateOfBirth ? userObj.dateOfBirth : null,
      userObj.phoneNumbers ? userObj.phoneNumbers : null,
      userObj.address ? userObj.address : null,
    );

    if (getBodyInfo && userObj.bodyInfo) {
      const userBodyInfo = new UserBodyInfo(
        userObj.id,
        userObj.bodyInfo.dateTaken,
        userObj.bodyInfo.trueAge,
        userObj.bodyInfo.weight,
        userObj.bodyInfo.height,
        userObj.bodyInfo.percBodyFat,
        userObj.bodyInfo.visceralFatRating,
        userObj.bodyInfo.restingMetabolism,
        userObj.bodyInfo.bodyAge,
        userObj.bodyInfo.bmi,
        userObj.bodyInfo.subcutaneousMeasurements,
        userObj.bodyInfo.skeletalMeasurements,
      );
      user.setFitnessParams(userBodyInfo);
    }

    return user;
  }
}
