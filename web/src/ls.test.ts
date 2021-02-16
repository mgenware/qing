import { expect } from 'qing-t';
import 'debug/d/injectLangEN';
import { ls, formatLS } from './ls';

it('ls', () => {
  expect(ls._lang).to.eq('en');
});

it('formatLS', () => {
  expect(formatLS(ls.pNOComments, 0)).to.eq('0 comments');
  expect(formatLS(ls.pNOComments, 1)).to.eq('1 comment');
  expect(formatLS(ls.pNOComments, 2)).to.eq('2 comments');
});
