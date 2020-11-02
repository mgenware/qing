import userWind from './userWind';

export default class User {
  static fromWindow(): User | null {
    if (userWind.appUserID) {
      return new User(
        userWind.appUserID,
        userWind.appUserName,
        userWind.appUserIconURL,
        userWind.appUserURL,
      );
    }
    return null;
  }

  constructor(public id: string, public name: string, public iconURL: string, public URL: string) {}
}
