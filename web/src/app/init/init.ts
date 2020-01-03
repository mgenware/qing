import bulmaSetup from './bulmaSetup';
import ls from 'ls';
import coreStyles from 'app/styles/core';
import { CSSResult } from 'lit-element';

// ---------------------------------
// unhandled excaptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

function started() {
  injectStyles(coreStyles as CSSResult[]);
  // bulma elements setup code
  // refs: https://bulma.io/documentation/components/modal/
  try {
    bulmaSetup();
  } catch (e) {
    console.error('Internal style initialization failed: ' + e);
  }
  // --------- end of bulma elements setup code ---------
}

function ready(fn: () => void) {
  const doc = document as any;
  if (
    doc.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

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

ready(() => {
  started();
});
