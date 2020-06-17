import ls from 'ls';
import coreStyles from 'app/styles/core';
import { CSSResult } from 'lit-element';
import { ready } from 'lib/htmlLib';

function injectStyles(styles: CSSResult[]) {
  for (const style of styles) {
    const css = style.cssText;
    // TODO: use constructable styles
    const styleElement = document.createElement('style') as HTMLStyleElement;
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(styleElement);
  }
}

// ---------------------------------
// unhandled excaptions
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
