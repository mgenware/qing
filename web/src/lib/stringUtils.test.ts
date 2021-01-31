import { expect } from 'qing-t';
import { splitLocalizedString } from './stringUtils';

it('splitLocalizedString', () => {
  expect(splitLocalizedString('a||b||c')).to.deep.eq(['a', 'b', 'c']);
});
