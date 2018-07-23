import { Injectable } from '@angular/core';
import { User, UserBodyInfo } from '../../models/user-model';

import { DateProvider } from './../../providers/date/date';

import firebase from 'firebase/app';
import 'firebase/firestore';


@Injectable()
export class BodyInfoProvider {
  bodyInfoRef: any;
  BODYINFO_COLLECTION: string = 'userBodyInfo';

  constructor(
    private dateProvider: DateProvider,
  ) {
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true,
    });

    this.bodyInfoRef = db.collection(this.BODYINFO_COLLECTION);
  }

  /**
   * Adds a new bodyInfo document in the
   * `userBodyInfo` collection.
   *
   * @param newUserBodyInfo
   */
  addBodyInfo(newUserBodyInfo: UserBodyInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!newUserBodyInfo) {
        reject('Enter Fitness Parameters to save!');
        return;
      }

      this.bodyInfoRef
        .add(newUserBodyInfo)
        .then(() => {
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  /**
   * Get all recorded `userBodyInfo` documents
   * for a particular user.
   * @param user
   */
  getAllBodyInfoForUser(user: User) {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject('User not defined!');
        return;
      }

      this.bodyInfoRef
        .where("uid", "==", user.id)
        .get()
        .then(querySnapshot => {
          let bodyInfoArray = [];

          querySnapshot.forEach(doc => {
            const bodyInfo = doc.data();
            bodyInfo.id = doc.id;
            const cleanedBodyInfo = this._getBodyInfo(bodyInfo);
            bodyInfoArray.push(cleanedBodyInfo);
          });

          resolve(bodyInfoArray);
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
  }

  private _getBodyInfo(bodyInfoObj: any) {
    const bodyInfo: UserBodyInfo = {
      uid: bodyInfoObj.uid,
      dateTaken: this.dateProvider.firebaseDateToDate(bodyInfoObj.dateTaken),
      trueAge: bodyInfoObj.trueAge,
      weight: bodyInfoObj.weight,
      height: bodyInfoObj.height,
      percBodyFat: bodyInfoObj.percBodyFat,
      visceralFatRating: bodyInfoObj.visceralFatRating,
      restingMetabolism: bodyInfoObj.restingMetabolism,
      bodyAge: bodyInfoObj.bodyAge,
      bmi: bodyInfoObj.bmi,
      subCutFatTotal: bodyInfoObj.subCutFatTotal,
      subCutFatTrunk: bodyInfoObj.subCutFatTrunk,
      subCutFatArms: bodyInfoObj.subCutFatArms,
      subCutFatLegs: bodyInfoObj.subCutFatLegs,
      skeletalMuscleTotal: bodyInfoObj.skeletalMuscleTotal,
      skeletalMuscleTrunk: bodyInfoObj.skeletalMuscleTrunk,
      skeletalMuscleArms: bodyInfoObj.skeletalMuscleArms,
      skeletalMuscleLegs: bodyInfoObj.skeletalMuscleLegs,
    };
    return bodyInfo;
  }

}
