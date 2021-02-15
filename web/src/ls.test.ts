import { expect } from 'qing-t';
import { ls, formatLS } from './ls';

it('ls', () => {
  expect(ls._lang).to.eq('en');
});

it('formatLS', () => {
  expect(formatLS(ls.pNOComments, 0)).to.eq('No comments');
  expect(formatLS(ls.pNOComments, 1)).to.eq('1 comments');
  expect(formatLS(ls.pNOComments, 2)).to.eq('2 comments');
});
