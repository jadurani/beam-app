import { Injectable } from '@angular/core';
import { User, UserBodyInfo } from './../../models/user-model';

import { DateProvider } from './../../providers/date/date';
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
  USER_COLLECTION: string = 'users';
  BODYINFO_COLLECTION: string = 'userBodyInfo';

  constructor(
    private dateProvider: DateProvider,
    private authProvider: AuthProvider,
  ) {
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
    if (authCurrentUser === null) {
      this.currentUser = null;
      return;
    }

    this.db.collection(this.USER_COLLECTION)
      .where('authId', '==', authCurrentUser.uid)
      .get()
      .then((querySnapshot) => {
        let userObj;

        querySnapshot.forEach(doc => {
          userObj = doc.data();
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

  /**
   * @method UserProvider.getUsers
   * @description
   * Query all the users from database if !useCache
   *
   * @param useCache {boolean}
   */
  getUsers(useCache: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if (useCache && this.usersList){
        resolve(this.usersList);
        return;
      }

      this.db.collection(this.USER_COLLECTION)
        .get()
        .then(querySnapshot => {
          let usersArray = [];

          querySnapshot.forEach(doc => {
            const userObj = doc.data();
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

  /**
   * @method UserProvider.getUserById
   * @description
   * Get user object by id, then initialize its values into
   * User instance.
   *
   * @param userId {string} Same as the User.id property
   */
  getUserById(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.USER_COLLECTION)
      .doc(userId)
      .get()
      .then(doc => {
        const userObj = doc.data();
        userObj.id = doc.id;
        const user = this._getUser(userObj, true);
        resolve(user);
      })
      .catch((error: any) => {
        reject(error);
      });
    });
  }

  /**
   * @method UserProvider.updateUser
   * @description
   * Update the user document in the firebase.
   * Firebase only accepts objects as arguments, hence we
   * get the User instance as object before passing it
   * to the database.
   *
   * @param user {User}
   */
  updateUser(user: User): Promise<any> {
    return new Promise ((resolve, reject) => {
      this.db.collection(this.USER_COLLECTION)
        .doc(user.id)
        .update(user)
        .then(() => {
          resolve(user);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  addBodyInfo(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!user.bodyInfo) {
        reject('Enter Fitness Parameters to save!');
        return;
      }

      this.updateUser(user)
        .then(updatedUser => {
          this.db.collection(this.BODYINFO_COLLECTION)
            .add(user.bodyInfo)
            .then(() => {
              resolve(updatedUser);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
      });
  }

  addUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.USER_COLLECTION)
        .add(user)
        .then(docRef => {
          resolve(docRef.id);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // deactivateUser() {}

  // activateUser() {}

  // searchUsers() {}

  // private log(message: string) {}

  private _getUser(
    userObj: any,
    fullUserInfo: boolean = false
  ) {
    const user: User = {
      id: userObj.id,
      dateJoined: this.dateProvider.firebaseDateToDate(userObj.dateJoined),
      roles: Object.assign({}, userObj.roles),
    };

    // AuthInfo
    if (userObj.authId) user.authId = userObj.authId;
    if (userObj.displayName) user.displayName = userObj.displayName;
    if (userObj.email) user.email = userObj.email;
    if (userObj.phoneNumber) user.phoneNumber = userObj.phoneNumber;
    if (userObj.photoUrl) user.photoUrl = userObj.photoUrl;

    // BasicInfo
    if (userObj.fullName) user.fullName = userObj.fullName;
    if (userObj.firstName && userObj.lastName) user.fullName = `${userObj.firstName} ${userObj.lastName}`;
    if (userObj.firstName) user.firstName = userObj.firstName;
    if (userObj.lastName) user.lastName = userObj.lastName;
    if (userObj.suffix) user.suffix = userObj.suffix;
    if (userObj.gender) user.gender = userObj.gender;
    if (userObj.dateOfBirth)
      user.dateOfBirth = this.dateProvider.firebaseDateToDate(userObj.dateOfBirth);
    if (userObj.phoneNumbers) user.phoneNumbers = userObj.phoneNumbers;
    if (userObj.address) user.address = userObj.address;

    if (fullUserInfo) {
      if (userObj.bodyInfo) {
        const userBodyInfo : UserBodyInfo = {
          uid: userObj.id,
          dateTaken: this.dateProvider.firebaseDateToDate(userObj.bodyInfo.dateTaken),
          trueAge: userObj.bodyInfo.trueAge,
          weight: userObj.bodyInfo.weight,
          height: userObj.bodyInfo.height,
          percBodyFat: userObj.bodyInfo.percBodyFat,
          visceralFatRating: userObj.bodyInfo.visceralFatRating,
          restingMetabolism: userObj.bodyInfo.restingMetabolism,
          bodyAge: userObj.bodyInfo.bodyAge,
          bmi: userObj.bodyInfo.bmi,
          subcutaneousMeasurements: Object.assign({}, userObj.bodyInfo.subcutaneousMeasurements),
          skeletalMeasurements: Object.assign({}, userObj.bodyInfo.skeletalMeasurements)
        };
        user.bodyInfo = userBodyInfo;
      }

      if (userObj.iceContact)
        user.iceContact = Object.assign({}, userObj.iceContact);

      if (userObj.otherRemarks)
        user.otherRemarks = userObj.otherRemarks;
    }

    return user;
  }

}
