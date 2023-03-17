import { expect } from 'dev/t.js';
import { entityTypeToLS } from './strings.js';
import { appdef } from '@qing/def';

it('entityTypeToLS', () => {
  expect(entityTypeToLS(appdef.ContentBaseType.post)).to.eq(globalThis.coreLS.post);
  expect(entityTypeToLS(appdef.ContentBaseType.cmt)).to.eq(globalThis.coreLS.comment);
  expect(entityTypeToLS(appdef.ContentBaseType.fPost)).to.eq(globalThis.coreLS.fPost);
});
