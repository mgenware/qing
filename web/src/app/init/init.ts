import ls, { formatLS, getLSByKey } from 'ls';
import coreStyles from 'app/styles/core';
import { CSSResult } from 'lit-element';
import { injectStyles, ready } from 'lib/htmlLib';

const localizedStringSlotClass = '__qing_ls__';

// ---------------------------------
// Handle uncaught exceptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  // eslint-disable-next-line no-alert
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

function handleLocalizedStringSlots() {
  const elements = document.getElementsByClassName(localizedStringSlotClass);
  for (const element of elements) {
    const key = element.textContent;
    if (key) {
      const { dataset } = element as HTMLElement;
      const params: string[] = [];
      if (dataset.lsArg1) {
        params.push(dataset.lsArg1);
      }
      if (dataset.lsArg2) {
        params.push(dataset.lsArg2);
      }
      if (dataset.lsArg3) {
        params.push(dataset.lsArg3);
      }
      const str = params.length ? formatLS(key, ...params) : getLSByKey(key);
      if (!str) {
        console.error(`Unresolved localized string key "${key}"`);
      }
      element.textContent = str;
    }
  }
}

ready(() => {
  // Make core styles cross all shadow roots.
  injectStyles(coreStyles as CSSResult[]);

  // Handle localization slots left by server templates.
  handleLocalizedStringSlots();
});
