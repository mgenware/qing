import wind from 'app/wind';

export default class User {
  static fromWindow(): User | null {
    if (wind.userID) {
      return new User(
        wind.userID,
        wind.userName,
        wind.userIconURL,
        wind.userURL,
      );
    }
    return null;
  }

  constructor(
    public id: string,
    public name: string,
    public iconURL: string,
    public URL: string,
  ) {}
}
