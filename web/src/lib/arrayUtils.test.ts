import { expect } from 'qing-t';
import { skipIndex, skipItem } from './arrayUtils';

it('skipIndex', () => {
  expect(skipIndex([1, 2, 3], 1)).to.deep.eq([1, 3]);
});

it('skipItem', () => {
  expect(skipItem([1, 2, 3], 2)).to.deep.eq([1, 3]);
});
