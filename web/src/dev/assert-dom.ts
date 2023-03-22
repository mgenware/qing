import { expect } from '@open-wc/testing';

export function isInlineElement(element: HTMLElement) {
  return expect(globalThis.getComputedStyle(element).display).to.eq('inline');
}

export function isBlockElement(element: HTMLElement) {
  return expect(window.getComputedStyle(element).display).to.eq('block');
}

export function isInlineBlockElement(element: HTMLElement) {
  return expect(window.getComputedStyle(element).display).to.eq('inline-block');
}

export function isFlexElement(element: HTMLElement) {
  return expect(window.getComputedStyle(element).display).to.eq('flex');
}
