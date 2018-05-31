import { Injectable } from '@angular/core';


/**
 * DateProvider
 *
 * All your date formatting needs should be addressed here.
 */
@Injectable()
export class DateProvider {
  firebaseDateToDate(firebaseDate : any) : Date {
    return firebaseDate.toDate();
  }

  stringToDate(stringDate : string) : Date {
    return new Date(stringDate);
  }

  dateNow(): Date {
    return new Date();
  }

  getAgeToday(dateOfBirth : Date) : number {
    return this.dateNow().getFullYear() - dateOfBirth.getFullYear();
  }
}
