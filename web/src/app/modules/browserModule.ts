export default class BrowserModule {
  get mainContentElement(): HTMLElement {
    const element = window.document.getElementById('main-body');
    if (!element) {
      throw new Error('Fatal error: main content element is null');
    }
    return element;
  }

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
