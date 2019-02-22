import User from '../user/User';

export default class AppState {
  user: User | null;
  lang: string;

  constructor() {
    // tslint:disable-next-line: no-any
    const wind = window as any;

    this.user = User.fromWindow();
    this.lang = wind.appLang || 'en';
  }

  get hasUser(): boolean {
    return this.user !== null;
  }

  get userID(): string {
    if (this.user !== null) {
      return this.user.id;
    }
    return '';
  }
}
