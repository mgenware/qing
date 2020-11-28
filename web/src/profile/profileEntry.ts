// Used in profile post list.
import { injectStyles, ready } from 'lib/htmlLib';
import { css } from 'lit-element';
import 'ui/cm/timeField';
import 'ui/cm2/tabView';
import 'ui/cm2/noContentView';
import { keyPosts } from 'sharedConstants';

const defaultHighlightedTab = keyPosts;
const highlightedTabClass = 'tab-active';

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
  const tab = qs.get('tab');
  if (tab) {
    // Scroll to feed list tab if `tab` query string is present.
    setTimeout(() => document.getElementById('m-profile-posts')?.scrollIntoView(true), 500);
  }

  // Highlight a tab in tab view.
  document
    .getElementById(`m-profile-tab-${tab || defaultHighlightedTab}`)
    ?.classList.add(highlightedTabClass);
});
