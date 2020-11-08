// Used in profile post list.
import { injectStyles } from 'lib/htmlLib';
import { css } from 'lit-element';
import 'ui/cm/timeField';
import profileWind from './profileWind';

const disabledCSS = 'content-disabled';

if (!profileWind.appIsPrevEnabled) {
  document.getElementById('m-prev-btn')?.classList.add(disabledCSS);
}
if (!profileWind.appIsNextEnabled) {
  document.getElementById('m-next-btn')?.classList.add(disabledCSS);
}

// Scroll to user posts only if `page` query string is present.
const qs = new URLSearchParams(window.location.search);
if (qs.get('page')) {
  setTimeout(() => document.getElementById('m-profile-posts')?.scrollIntoView(true), 800);
}

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
