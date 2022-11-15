import { expect } from 'dev/t';
import ls from 'ls';
import { entityTypeToLS } from './strings';
import { appdef } from '@qing/def';

it('entityTypeToLS', () => {
  expect(entityTypeToLS(appdef.ContentBaseType.post)).to.eq(ls.post);
  expect(entityTypeToLS(appdef.ContentBaseType.cmt)).to.eq(ls.comment);
  expect(entityTypeToLS(appdef.ContentBaseType.fPost)).to.eq(ls.fPost);
});
