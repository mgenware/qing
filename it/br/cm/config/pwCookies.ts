import { BrowserContext } from '@playwright/test';
import { serverURL } from 'base/def.js';

export default class PWCookies {
  static async setCookieAsync(context: BrowserContext, key: string, value: string) {
    await context.addCookies([{ name: key, value: encodeURIComponent(value), url: serverURL }]);
  }
}
