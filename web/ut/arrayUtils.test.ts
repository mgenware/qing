import * as assert from 'assert';
import { skipIndex } from '../src/lib/arrayUtils';

it('skipIndex', () => {
  assert.deepStrictEqual(skipIndex([1, 2, 3], 1), [1, 3]);
});
