import { expect, html, fixture } from 'qing-t';
import BaseElement from './baseElement';

it('getShadowElements', async () => {
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

  const el: TElement = await fixture(html`<t-base-element></t-base-element>`);

  expect(el.getRootDiv() instanceof HTMLDivElement).to.eq(true);
  expect(() => {
    el.getNonExistentDiv();
  }).to.throw('Core DOM element "__error__" missing');
});
