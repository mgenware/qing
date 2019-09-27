import escapeHTML from 'escape-html';

export function parseDOMString(str: string): Element | null {
  if (!str) {
    return null;
  }
  const tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  const list = tmp.body.children;
  if (list && list.length) {
    return list.item(0);
  }
  return null;
}

export function removeElement(element: Element) {
  const { parentNode } = element;
  if (parentNode) {
    parentNode.removeChild(element);
  }
}

export function wrap(el: Element, wrapper: Element | null) {
  if (!el.parentNode || !wrapper) {
    return;
  }
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

export function getElementByID(id: string, cb: (element: HTMLElement) => void) {
  if (!id) {
    return;
  }
  if (id.startsWith('#')) {
    id = id.substr(1);
  }
  const element = document.getElementById(id);
  if (element && cb) {
    cb(element);
  }
}

export function constructURL(params: object): string {
  // params as URLSearchParams: just to mute type error
  return new URLSearchParams(params as URLSearchParams).toString();
}

export function ready(fn: () => void) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function encodeHTML(s: string): string {
  return escapeHTML(s);
}
