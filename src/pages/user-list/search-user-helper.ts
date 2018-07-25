import { SearchProvider } from "../../providers/search/search";
import { DatabaseProvider } from "../../providers/database/database";


export class SearchUserHelper {
  searchProvider: SearchProvider;
  termSet: any;

  constructor() {
    this.searchProvider = new SearchProvider(new DatabaseProvider());
    this.getUserSearchTerms();
  }

  getUserSearchTerms() {
    this.searchProvider.getUsersTerms()
      .then(termsObj => {
        this.termSet = termsObj;
      });
  }

  private _getNames(searchObj: {fullName:string, displayName:string}) {
    let fullNameParts = searchObj.fullName.toLowerCase().split(' ');
    let displayNameParts = searchObj.displayName.toLowerCase().split(' ');
    return [...fullNameParts, ...displayNameParts];
  }

  getMatches(searchInput: string) {
    searchInput = searchInput.toLowerCase();
    let matches = [];

    for (let keyId in this.termSet) {
      let names = this._getNames(this.termSet[keyId]);
      let hasMatch = names.some(name => name.indexOf(searchInput) == 0);
      if (hasMatch) {
        matches.push(Object.assign({id: keyId}, this.termSet[keyId]));
      }
    }

    return matches;
  }
}
