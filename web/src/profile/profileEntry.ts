import wind from './wind';

if (!wind.isPrevEnabled) {
  document.getElementById('m-prev-btn')?.classList.add('content-disabled');
}
if (!wind.isNextEnabled) {
  document.getElementById('m-next-btn')?.classList.add('content-disabled');
}

// Scroll to user posts only if `page` query string is present.
const qs = new URLSearchParams(window.location.search);
if (qs.get('page')) {
  setTimeout(
    () => document.getElementById('m-profile-posts')?.scrollIntoView(true),
    800,
  );
}
