import MasterWind from 'app/masterWind';
import { defaultLang } from 'sharedConstants';
import User from '../user/user';

export type UserCallbackFn = (user: User) => void;

export default class AppState {
  readonly lang: string;
  readonly forumsMode: boolean;
  #windData: unknown;
  #user: User | null = null;
  #userListeners: UserCallbackFn[] = [];

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wind = (window as any) as MasterWind;

    this.lang = wind.appLang ?? defaultLang;
    this.forumsMode = wind.appForumsMode;
    this.#windData = wind.appWindData ?? {};
    if (wind.appUserID) {
      this.#user = {
        eid: wind.appUserID,
        name: wind.appUserName,
        url: wind.appUserURL,
        iconURL: wind.appUserIconURL,
        admin: wind.appUserAdmin,
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
