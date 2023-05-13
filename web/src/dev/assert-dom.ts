import { expect } from '@open-wc/testing';

export function isInlineElement(element: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  expect(globalThis.getComputedStyle(element).display).to.eq('inline');
}

export function isBlockElement(element: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  expect(window.getComputedStyle(element).display).to.eq('block');
}

export function isInlineBlockElement(element: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  expect(window.getComputedStyle(element).display).to.eq('inline-block');
}

export function isFlexElement(element: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  expect(window.getComputedStyle(element).display).to.eq('flex');
}
