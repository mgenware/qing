import * as assert from 'assert';
import { skipIndex, skipItem } from './arrayUtils';

it('skipIndex', () => {
  assert.deepStrictEqual(skipIndex([1, 2, 3], 1), [1, 3]);
});

it('skipItem', () => {
  assert.deepStrictEqual(skipItem([1, 2, 3], 2), [1, 3]);
});
