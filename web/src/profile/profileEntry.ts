import wind from './wind';

if (!wind.isPrevEnabled) {
  document.getElementById('m-prev-btn')?.classList.add('content-disabled');
}
if (!wind.isNextEnabled) {
  document.getElementById('m-next-btn')?.classList.add('content-disabled');
}
