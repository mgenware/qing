import { TemplateResult } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html } from 'lit-html';

export function ready(fn: () => void) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
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
  container: HTMLElement | string,
  template: TemplateResult | null,
): HTMLElement | null {
  let containerElement: HTMLElement;
  if (typeof container === 'string') {
    let element = document.getElementById(container);
    if (!element) {
      element = document.createElement('div');
      element.id = container;
      document.body.append(element);
    }
    containerElement = element;
  } else {
    containerElement = container;
  }
  render(template ?? html``, containerElement);
  return containerElement.firstElementChild as HTMLElement | null;
}

export function listenForVisibilityChange(
  elements: HTMLElement[],
  callback: (element: HTMLElement) => void,
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.target as HTMLElement);
    });
  });
  for (const element of elements) {
    observer.observe(element);
  }
}
