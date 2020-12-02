// Used in profile post list.
import { injectStyles, ready } from 'lib/htmlLib';
import { css } from 'lit-element';
import 'ui/com/timeField';
import 'ui//com2//tabView';
import { tabViewActiveClass } from 'ui//com2//tabView';
import 'ui//com2//noContentView';
import 'ui/com/tagView';
import { keyPage, keyPosts, keyTab } from 'sharedConstants';
import profileWind from './profileWind';
import './views/profileIDView';

const defaultHighlightedTab = keyPosts;

const styles = css`
  .is-boxed {
    border-top: 1px solid var(--default-separator-color);
    border-bottom: 1px solid var(--default-separator-color);
  }

  @media (min-width: 768px) {
    .is-boxed {
      border: 1px solid var(--default-separator-color);
      border-radius: 0.5rem;
      padding: 0.8rem 1.6rem;
    }
  }

  .tag-default {
    border-radius: 5px;
    padding: 0.2rem 0.7rem;
  }
`;
injectStyles([styles]);

ready(() => {
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(keyTab);
  const page = qs.get(keyPage);

  // Scroll to feed list tab if `tab` or `page` are present.
  if (tab || page) {
    setTimeout(() => document.getElementById('m-profile-posts')?.scrollIntoView(true), 500);
  }

  // Highlight a tab in tab view.
  document
    .getElementById(`m-profile-tab-${tab ?? defaultHighlightedTab}`)
    ?.classList.add(tabViewActiveClass);

  // Set user URL.
  const website = profileWind.appProfileWebsite;
  if (website) {
    document
      .getElementById('m-profile-url')
      ?.setAttribute('href', website.includes('://') ? website : `http://${website}`);
  }
});
