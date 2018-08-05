import { Injectable } from '@angular/core';
import { User, UserBodyInfo } from './../../models/user-model';

import { AuthProvider } from './../../providers/auth/auth';
import { DatabaseProvider } from '../database/database';
import { DateProvider } from './../../providers/date/date';
import { SearchProvider } from '../search/search';

/**
 * UserProvider
 *
 * @method getUsers
 * @method getUserById
 */
@Injectable()
export class UserProvider {
  userRef: any;
  currentUser: User;
  usersList : User[];
  USER_COLLECTION: string = 'users';

  constructor(
    private authProvider: AuthProvider,
    private databaseProvider: DatabaseProvider,
    private dateProvider: DateProvider,
    private searchProvider: SearchProvider,
  ) {
    this.userRef = this.databaseProvider
      .getCollection(this.USER_COLLECTION);
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

    this.userRef
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
   * Query all the users,
   */
  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userRef.get()
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
          console.log(error);
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
      this.userRef
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
   * Also updates the SearchTerm/Indices for the User if
   * `onEditBasicInfo` is true.
   * @param user {User}
   */
  async updateUser(
    user: User,
    onEditBasicInfo: boolean = false
  ): Promise<User> {

    await this.userRef.doc(user.id).update(user);

    if (onEditBasicInfo)
      await this._addSearchKey(user.id, user.fullName, user.displayName);

    return user;
  }

  /**
   * @method UserProvider.updateUser
   * @description
   * Adds a new user.
   *
   * Also adds the SearchTerm/Indices for the User.
   * @param user {User}
   */
  async addUser(user: User): Promise<string> {
    const docRef = await this.userRef
        .add(user);
    const userId = docRef.id;

    await this._addSearchKey(userId, user.fullName, user.displayName);
    return userId;
  }

  /**
   * @method UserProvider.refreshSearchTerms
   * @description
   * Repopulate searchKeys with all the users' searchTerms.
   *
   * Ideally, Use only on DEV mode.
   */
  private async _refreshSearchTerms() {
    let termSet = {};
    this.usersList.forEach(user => {
      termSet[user.id] = {
        fullName: user.fullName,
        displayName: user.displayName || '',
      };
    });

    await this.searchProvider.addUserTerm(termSet);
  }

  /**
   * @method UserProvider._addSearchKey
   * @description
   * Adds an individual searchKey into the `searchKeys` collection.
   *
   * @param id {User.id}
   * @param fullName {User.fullName}
   * @param displayName {User.displayName}
   */
  private async _addSearchKey(id: string, fullName:string, displayName:string) {
    let userSearchTerm = {};
    userSearchTerm[id] = {
      fullName,
      displayName,
    };

    await this.searchProvider.addUserTerm(userSearchTerm);
  };

  // deactivateUser() {}

  // activateUser() {}

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
    if (userObj.sex) user.sex = userObj.sex;
    if (userObj.prefix) user.prefix = userObj.prefix;

    if (userObj.dateOfBirth)
      user.dateOfBirth = this.dateProvider.firebaseDateToDate(userObj.dateOfBirth);

    if (userObj.phoneNumbers) user.phoneNumbers = userObj.phoneNumbers;
    if (userObj.address) user.address = userObj.address;

    if (fullUserInfo) {
      if (userObj.bodyInfo) {
        const userBodyInfo : UserBodyInfo = {
          uid: userObj.id,
          dateTaken: this.dateProvider.firebaseDateToDate(
            userObj.bodyInfo.dateTaken),
          trueAge: userObj.bodyInfo.trueAge,
          weight: userObj.bodyInfo.weight,
          height: userObj.bodyInfo.height,
          percBodyFat: userObj.bodyInfo.percBodyFat,
          visceralFatRating: userObj.bodyInfo.visceralFatRating,
          restingMetabolism: userObj.bodyInfo.restingMetabolism,
          bodyAge: userObj.bodyInfo.bodyAge,
          bmi: userObj.bodyInfo.bmi,
          subCutFatArms: userObj.bodyInfo.subCutFatArms,
          subCutFatLegs: userObj.bodyInfo.subCutFatLegs,
          subCutFatTotal: userObj.bodyInfo.subCutFatTotal,
          subCutFatTrunk: userObj.bodyInfo.subCutFatTrunk,
          skeletalMuscleArms: userObj.bodyInfo.skeletalMuscleArms,
          skeletalMuscleLegs: userObj.bodyInfo.skeletalMuscleLegs,
          skeletalMuscleTotal: userObj.bodyInfo.skeletalMuscleTotal,
          skeletalMuscleTrunk: userObj.bodyInfo.skeletalMuscleTrunk,
        };
        user.bodyInfo = userBodyInfo;
      }

      if (userObj.iceContact)
        user.iceContact = Object.assign({}, userObj.iceContact);

      if (userObj.workDetails) user.workDetails = userObj.workDetails;
      if (userObj.socialMedia) user.socialMedia = userObj.socialMedia;
      if (userObj.otherRemarks) user.otherRemarks = userObj.otherRemarks;
    }

    return user;
  }

}
