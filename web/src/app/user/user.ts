import MulticastDelegate from '@/lib/multicastDelegate';

export default class User {
  static fromWindow(): User | null {
    // tslint:disable-next-line: no-any
    const wind = window as any;
    if (wind.appUserID) {
      return new User(wind.appUserID, wind.appUserName, wind.appUserURL);
    }
    return null;
  }

  changedDelegate = new MulticastDelegate();

  constructor(
    public id: string,
    public name: string,
    public profileURL: string,
  ) {}

  notifyChanges() {
    this.changedDelegate.invoke(this);
  }
}
