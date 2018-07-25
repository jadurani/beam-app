import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

/**
 * Queries the search keys / indices for select entities.
 * Currently indexed:
 * - Users
 */
@Injectable()
export class SearchProvider {
  db: any;
  searchRef: any;
  SEARCH_TERMS_COLLECTION: string = 'searchTerms';

  constructor(
    private databaseProvider: DatabaseProvider,
  ) {
    this.searchRef = this.databaseProvider
      .getCollection(this.SEARCH_TERMS_COLLECTION);
  }

  /**
   * General getter of indices.
   *
   * @param termGroup The indexed entity group
   * you're searching at.
   */
  async getTerms(termGroup: string) {
    const doc = await this.searchRef
      .doc(termGroup)
      .get();

    return doc.data();
  }

  /**
   * Retrieves all search terms for users.
   */
  async getUsersTerms() {
    return await this.getTerms('users');
  }

  /**
   *
   * @param userTermSet Should be of the ff format:
   * {
   *   <user_id(hashId)>: {
   *     fullName: string;
   *     displayName: string;
   *   }
   * }
   */
  async addUserTerm(userTermSet) {
    return await this.searchRef
      .doc('users')
      .update(userTermSet);
  }
}

