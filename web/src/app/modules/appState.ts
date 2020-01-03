import User from '../user/user';

export type UserCallbackFn = (user: User | null) => void;

export default class AppState {
  lang: string;
  // Some of the user properties are volatile, use getUserInfo to access them.
  private user: User | null;
  private userListeners: UserCallbackFn[] = [];

  constructor() {
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

  getUserInfo(recurring: boolean, cb: UserCallbackFn) {
    cb(this.user);
    if (recurring) {
      this.userListeners.push(cb);
    }
  }

  updateUser(cb: (user: User | null) => User | null) {
    const { user } = this;
    const copiedUser = user
      ? new User(user.id, user.name, user.iconURL, user.URL)
      : null;
    const newUser = cb(copiedUser);
    this.user = newUser;
    for (const listener of this.userListeners) {
      listener(newUser);
    }
  }
}
