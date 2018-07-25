import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import 'firebase/firestore';


/**
 * Initializes firestore and retrieves collection
 * references for the other providers.
 *
 * Do not initialize firestore in other providers.
 * If you see a provider doing so, inject DatabaseProvider
 * to it instead. There will be conflicts when a provider
 * that already initialized firestore gets injected into
 * a provider that also initializes firestore.
 */
@Injectable()
export class DatabaseProvider {
  db: any;

  constructor() {
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true,
    });
  }

  getCollection(name: string) {
    return this.db.collection(name);
  }
}
