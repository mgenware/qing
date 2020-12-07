import ls, { getLSByKey } from 'ls';
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
    const { textContent } = element;
    if (textContent) {
      const str = getLSByKey(textContent);
      if (!str) {
        console.error(`Unresolved localized string key "${textContent}"`);
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
