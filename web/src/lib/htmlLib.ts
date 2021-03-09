import { CSSResult, TemplateResult } from 'lit-element';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, html } from 'lit-html';

export function ready(fn: () => void) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

let renderTemplateCounter = 1;

// Renders the given template result to the specified container.
// Returns the first element child of the container.
// NOTE: container contents will be cleared before rendering.
export function renderTemplateResult<T extends HTMLElement>(
  container: HTMLElement | string,
  template: TemplateResult | null,
): T | null {
  // IMPORTANT NOTE:
  // By default, `render` in lit-html tries to update the container
  // (instead of a full re-render) if `render` was called on the
  // container. To always start a full re-render, we'll do the following:
  //  - Remove all children of the container
  //  - Add an empty div to the container and mount content to the div
  let containerElement: HTMLElement;
  if (typeof container === 'string') {
    // eslint-disable-next-line no-param-reassign
    container = container || `__r_tpl_slot_${renderTemplateCounter++}`;
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

  containerElement.innerHTML = '';
  // See the note above for why we create this extra div.
  const div = document.createElement('div');
  containerElement.appendChild(div);
  render(template ?? html``, div);
  // Template is rendered under the div element.
  return div.firstElementChild as T | null;
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

export function injectStyles(styles: CSSResult[]) {
  for (const style of styles) {
    const css = style.cssText;
    // TODO: use constructable styles
    const styleElement = document.createElement('style') as HTMLStyleElement;
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
  }
}

export function tif<T>(condition: unknown, template: T): T | '' {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (condition) {
    return template;
  }
  return '';
}
