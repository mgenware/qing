import bulmaSetup from './bulmaSetup';
import ls from 'ls';
import mainStyles from '../styles/main-min';

// ---------------------------------
// unhandled excaptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

function started() {
  injectStyle(mainStyles.cssText);
  // bulma elements setup code
  // refs: https://bulma.io/documentation/components/modal/
  try {
    bulmaSetup();
  } catch (e) {
    // tslint:disable-next-line no-console
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

function injectStyle(css: string) {
  // TODO: use constructable styles
  const style = document.createElement('style') as HTMLStyleElement;
  style.type = 'text/css';
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);
}

ready(() => {
  started();
});
