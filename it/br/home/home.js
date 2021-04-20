import { it } from '../t.js';
import * as assert from 'assert';

it('Home page', async (br) => {
  await br.goto('/');
  const c = await br.content();
  assert.ok(c.length);
});
