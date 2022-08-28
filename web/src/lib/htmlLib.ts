/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, render, TemplateResult } from 'll';

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
      // Put new element in `body > main` instead of `body`, we have CSS
      // grid styles applied that require exact 3 children in `body`.
      document.querySelector('body > main')?.append(element);
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
