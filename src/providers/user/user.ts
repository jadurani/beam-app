import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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

  constructor(public http: HttpClient) {
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

  // searchUsers() {}

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
