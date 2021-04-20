import puppeteer from 'puppeteer';

const browserPromise = puppeteer.launch();

export class Browser {
  /**
   * Creates a `Browser`.
   * @param {puppeteer.BrowserContext} context
   * @param {string} context
   */
  constructor(name, context, page) {
    /**
     * Gets the name of this test.
     * @param {string}
     * @public
     */
    this.name = name;
    /**
     * Gets the puppeteer context.
     * @param {puppeteer.BrowserContext}
     * @public
     */
    this.context = context;
    /**
     * Gets the puppeteer page.
     * @param {puppeteer.Page}
     * @public
     */
    this.page = page;
  }

  /**
   * Navigates to the specified URL.
   * @param {string} url
   * @returns {Promise<puppeteer.HTTPResponse | null>}
   */
  goto(url) {
    return this.page.goto(`http://localhost:12001${url}`);
  }

  /**
   * Gets the content of the page.
   * @returns {Promise<string>}
   */
  content() {
    return this.page.content();
  }

  dispose() {
    return this.context.close();
  }
}

/**
 * Description of the function
 * @name ItCallback
 * @function
 * @param {Browser} br
 */

/**
 *
 * @param {string} name
 * @param {ItCallback} handler
 */
export async function it(name, handler) {
  const globalBrowser = await browserPromise;
  const context = await globalBrowser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const userBrowser = new Browser(name, context, page);
  await handler(userBrowser);
  await userBrowser.dispose();
}
