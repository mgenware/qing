export default class BrowserModule {
  jumpToURL(url: string) {
    window.location.href = url;
  }

  setURL(url: string) {
    window.location.replace(url);
  }

  reload() {
    window.location.reload();
  }

  openWindow(url: string) {
    window.open(url, '_blank');
  }
}
