import { defaultLang } from 'sharedConstants';
import masterWind from '../masterWind';
import User from '../user/user';

export type UserCallbackFn = (user: User) => void;

export default class AppState {
  readonly lang: string;
  readonly forumsMode: boolean;
  #windData: unknown;
  #user: User | null = null;
  #userListeners: UserCallbackFn[] = [];

  constructor() {
    this.lang = masterWind.appLang || defaultLang;
    this.forumsMode = masterWind.appForumsMode;
    this.#windData = masterWind.appWindData;
    if (masterWind.appUserID) {
      this.#user = {
        eid: masterWind.appUserID,
        name: masterWind.appUserName,
        url: masterWind.appUserURL,
        iconURL: masterWind.appUserIconURL,
        admin: masterWind.appUserAdmin,
      };
    }
  }

  get hasUser(): boolean {
    return this.#user !== null;
  }

  get user(): User | null {
    return this.#user;
  }

  get userEID(): string {
    if (this.#user !== null) {
      return this.#user.eid;
    }
    return '';
  }

  windData<T>(): T {
    return this.#windData as T;
  }

  updateUser(part: Partial<User>) {
    if (!this.#user) {
      return;
    }
    this.#user = {
      ...this.#user,
      ...part,
    };
    for (const listener of this.#userListeners) {
      listener(this.#user);
    }
  }

  addUserListener(listener: UserCallbackFn) {
    this.#userListeners.push(listener);
  }
}
