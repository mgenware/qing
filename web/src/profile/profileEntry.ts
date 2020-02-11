import wind from './wind';

if (!wind.isPrevEnabled) {
  document.getElementById('m-prev-btn')?.setAttribute('disabled', '');
}
if (!wind.isNextEnabled) {
  document.getElementById('m-next-btn')?.setAttribute('disabled', '');
}
