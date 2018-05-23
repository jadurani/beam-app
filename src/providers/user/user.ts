import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { catchError, map, tap } from 'rxjs/operators';

import * as firebase from 'firebase'; //need to address later
import 'firebase/firestore';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  db: any;

  constructor(public http: HttpClient) {
    console.log('Hello UserProvider Provider');

    this.db = firebase.firestore();
  }

  getUsers(): Observable<User[]> {
    return of(USERS_MOCK_LIST);
  }

  getUserById(id: any): Observable<User> {
    const currUser = USERS_MOCK_LIST.find(user => user.id === id);
    return of(currUser);
  }

  // updateUser() {}

  // addUser() {}

  // deactivateUser() {}

  // activateUser() {}

  searchUsers() {}

  signup(accountInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(
        accountInfo.email, accountInfo.password
      )
      .then(() => {
        resolve();
      })
      .catch((errorObj) => {
        // `error` has attributes `code` and `message`
        reject(errorObj);
      });
    });
  }

  login(accountInfo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(
        accountInfo.email, accountInfo.password
      )
        .then(() => {
          resolve();
        })
        .catch((errorObj) => {
          // `error` has attributes `code` and `message`
          reject(errorObj);
        });
    });
  }

  // private log(message: string) {}
}

export class User {
  id: any;
  firstName: string;
  lastName: string;
  userType: string;
  dateJoined: Date;

  constructor(id, firstName, lastName, userType, dateJoined) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userType = userType;
    this.dateJoined = dateJoined;
  }
}

// const USERS_MOCK_LIST: User[] = [];
const USERS_MOCK_LIST: User[] = [
  new User(1, 'Cornelius', 'Hewertson', 'owner', new Date()),
  new User(2, 'Parke', 'Roddie', 'staff', new Date()),
  new User(3, 'Nancie', 'Marages', 'trainer', new Date())
];
