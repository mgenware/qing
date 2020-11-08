import masterWind from '../masterWind';

export default class User {
  static fromWindow(): User | null {
    if (masterWind.appUserID) {
      return new User(
        masterWind.appUserID,
        masterWind.appUserName,
        masterWind.appUserIconURL,
        masterWind.appUserURL,
      );
    }
    return null;
  }

  constructor(public id: string, public name: string, public iconURL: string, public URL: string) {}
}
