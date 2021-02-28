import { expect, html, fixture, tDOM } from 'qing-t';
import BaseElement from './baseElement';

class TElement extends BaseElement {
  render() {
    return html`<div id="root">content</div>`;
  }

  getRootDiv(): HTMLDivElement {
    return this.mustGetShadowElement('root');
  }

  getNonExistentDiv(): HTMLDivElement {
    return this.mustGetShadowElement('__error__');
  }
}
customElements.define('t-base-element', TElement);

it('Display', async () => {
  const el: TElement = await fixture(html`<t-base-element></t-base-element>`);

  tDOM.isInlineElement(el);
});

it('getShadowElements', async () => {
  const el: TElement = await fixture(html`<t-base-element></t-base-element>`);

  expect(el.getRootDiv() instanceof HTMLDivElement).to.eq(true);
  expect(() => {
    el.getNonExistentDiv();
  }).to.throw('Core DOM element "__error__" missing');
});
