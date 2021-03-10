import { html, fixture, tDOM } from 'qing-t';
import './votingView';

it('Display', async () => {
  const el = await fixture<HTMLElement>(html`<voting-view></voting-view>`);

  tDOM.isBlockElement(el);
});
