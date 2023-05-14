import { expect } from 'dev/t.js';
import { entityTypeToLS } from './strings.js';
import { frozenDef } from '@qing/def';

it('entityTypeToLS', () => {
  expect(entityTypeToLS(frozenDef.ContentBaseType.post)).to.eq(globalThis.coreLS.post);
  expect(entityTypeToLS(frozenDef.ContentBaseType.cmt)).to.eq(globalThis.coreLS.comment);
  expect(entityTypeToLS(frozenDef.ContentBaseType.fPost)).to.eq(globalThis.coreLS.fPost);
});
