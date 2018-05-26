import { Injectable } from '@angular/core';
import { User, UserBodyInfo } from './../../models/user-model';

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
  usersList : User[];
  COLLECTION: string = 'users';

  constructor() {
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true,
    });
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
    const user = new User(userObj.id, userObj.dateJoined);

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
