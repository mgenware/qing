import Vue from 'vue';
import NavBarApp from './user/NavBarApp.vue';
import app from '@/app';
import bulmaSetup from './bulmaSetup';
import ls from '@/ls';

// ---------------------------------
// unhandled excaptions
// ---------------------------------
window.onerror = (error, url, lineNumber) => {
  alert(`${ls.internalErr}: ${error}: ${url}: ${lineNumber}`);
  return false;
};

const wind = window as any;
wind.Vue = Vue;

function starting() {
  // ---------------------------------
  // on loaded
  // ---------------------------------
  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line: no-console
    console.log('App started in dev mode');
  }

  app.mountComponent('#nav_user_app', NavBarApp);
}

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

export default function init() {
  starting();
  document.addEventListener('DOMContentLoaded', () => {
    started();
  });
}
