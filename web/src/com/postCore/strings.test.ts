import { expect } from 'dev/t';
import ls from 'ls';
import { entityTypeToLS } from './strings';
import { appdef } from '@qing/def';

it('entityTypeToLS', () => {
  expect(entityTypeToLS(appdef.contentBaseTypePost)).to.eq(ls.post);
  expect(entityTypeToLS(appdef.contentBaseTypeCmt)).to.eq(ls.comment);
  expect(entityTypeToLS(appdef.contentBaseTypeThread)).to.eq(ls.thread);
  expect(entityTypeToLS(appdef.contentBaseTypeThreadMsg)).to.eq(ls.reply);
});
