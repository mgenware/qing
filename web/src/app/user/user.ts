export default class User {
  static fromWindow(): User | null {
    // tslint:disable-next-line: no-any
    const wind = window as any;
    if (wind.appUserID) {
      return new User(
        wind.appUserID,
        wind.appUserName,
        wind.appUserIconURL,
        wind.appUserURL,
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
