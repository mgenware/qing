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

document.addEventListener('DOMContentLoaded', () => {
  started();
});
