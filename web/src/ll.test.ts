/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { BaseElement } from 'll';
import { expect, html, fixture, tDOM } from 'dev/t';

class TElement extends BaseElement {
  render() {
    return html`<div id="id" class="cls">content</div>`;
  }

  getShadowElementImpl(id: string): HTMLElement | null {
    return this.getShadowElement(id);
  }

  queryShadowElementImpl(sel: string): HTMLElement | null {
    return this.queryShadowElement(sel);
  }

  unsafeGetShadowElementImpl(id: string): HTMLElement {
    return this.unsafeGetShadowElement(id);
  }

  unsafeQueryShadowElementImpl(sel: string): HTMLElement {
    return this.unsafeQueryShadowElement(sel);
  }
}
customElements.define('t-base-element', TElement);

it('Display', async () => {
  const el: TElement = await fixture(html`<t-base-element></t-base-element>`);

  tDOM.isInlineElement(el);
});

it('getShadowElement', async () => {
  const el = await fixture<TElement>(html`<t-base-element></t-base-element>`);

  expect(el.getShadowElementImpl('id')?.textContent).to.eq('content');
  expect(el.getShadowElementImpl('id__')).to.eq(null);
  expect(el.unsafeGetShadowElementImpl('id__')).to.throw();
});

it('queryShadowElement', async () => {
  const el = await fixture<TElement>(html`<t-base-element></t-base-element>`);

  expect(el.queryShadowElementImpl('.cls')?.textContent).to.eq('content');
  expect(el.queryShadowElementImpl('.cls__')).to.eq(null);
  expect(el.unsafeQueryShadowElementImpl('.cls__')).to.throw();
});
