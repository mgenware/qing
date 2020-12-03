import { injectStyles, ready } from 'lib/htmlLib';
import 'ui/content/timeField';
import 'ui/lists/tabView';
import { tabViewActiveClass } from 'ui/lists/tabView';
import { css } from 'lit-element';
import { keyTab } from 'sharedConstants';

const defaultHighlightedTab = 'home';

const styles = css`
  .item-title {
    font-size: 1.3rem;
  }
`;
injectStyles([styles]);

ready(() => {
  // Highlight the selected tab.
  const qs = new URLSearchParams(window.location.search);
  const tab = qs.get(keyTab);
  document
    .getElementById(`m-home-tab-${tab ?? defaultHighlightedTab}`)
    ?.classList.add(tabViewActiveClass);
});
