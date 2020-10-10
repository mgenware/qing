import ls from 'ls';
import coreStyles from 'app/styles/core';
import { CSSResult } from 'lit-element';
import { injectStyles, ready } from 'lib/htmlLib';

// ---------------------------------
// Handle uncaught exceptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  // eslint-disable-next-line no-alert
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

function started() {
  injectStyles(coreStyles as CSSResult[]);
}

ready(() => {
  started();
});
