import escapeHTML from 'escape-html';
import { TemplateResult } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html } from 'lit-html';

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

export function constructURL(params: Record<string, string>): string {
  // params as URLSearchParams: just to mute type error
  return new URLSearchParams(params).toString();
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

export function resizeSVGHTML(
  svg: string,
  width: number,
  height: number,
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const element = doc.documentElement;
  element.setAttribute('width', width.toString());
  element.setAttribute('height', height.toString());
  return element.outerHTML;
}

export function renderTemplateResult(
  container: HTMLElement,
  template: TemplateResult | null,
): HTMLElement | null {
  render(template ?? html``, container);
  return container.firstElementChild as HTMLElement | null;
}
