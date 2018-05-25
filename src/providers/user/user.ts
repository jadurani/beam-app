import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { User } from './../../models/user-model';

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

  getUserById(id: string): Observable<User> {;
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

const USERS_MOCK_LIST: User[] = [
  new User('1', 'Cornelius'),
  new User('2', 'Parke'),
  new User('3', 'Nancie')
];
