/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { html, render, TemplateResult } from 'll.js';

export function ready(fn: () => void) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

let renderTemplateCounter = 1;

interface RenderTemplateOptions {
  force?: boolean;
}

// Renders the given template result to the specified container.
// Returns the first element child of the container.
// NOTE: container contents will be cleared before rendering.
export function renderTemplateResult<T extends HTMLElement>(
  container: HTMLElement | string | null,
  template: TemplateResult | null,
  opts?: RenderTemplateOptions,
): T | null {
  let containerElement: HTMLElement;
  if (typeof container === 'string' || !container) {
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

  if (opts?.force) {
    containerElement.replaceChildren();
  }
  render(template ?? html``, containerElement);
  return containerElement.firstElementChild as T | null;
}

export function listenForVisibilityChange(
  element: HTMLElement,
  callback: (element: HTMLElement) => unknown,
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.target as HTMLElement);
    });
  });
  observer.observe(element);
  return () => observer.unobserve(element);
}
