import bulmaStyles from '../styles/bulma';
import bulmaSetup from './bulmaSetup';
import ls from '../../ls';

// ---------------------------------
// unhandled excaptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

function started() {
  const doc = document as any;
  doc.adoptedStyleSheets = [
    ...(doc.adoptedStyleSheets || []),
    bulmaStyles.styleSheet,
  ];
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

ready(() => {
  started();
});
