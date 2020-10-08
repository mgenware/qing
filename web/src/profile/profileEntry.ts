import wind from './wind';

const disabledCSS = 'content-disabled';

if (!wind.isPrevEnabled) {
  document.getElementById('m-prev-btn')?.classList.add(disabledCSS);
}
if (!wind.isNextEnabled) {
  document.getElementById('m-next-btn')?.classList.add(disabledCSS);
}

// Scroll to user posts only if `page` query string is present.
const qs = new URLSearchParams(window.location.search);
if (qs.get('page')) {
  setTimeout(() => document.getElementById('m-profile-posts')?.scrollIntoView(true), 800);
}
