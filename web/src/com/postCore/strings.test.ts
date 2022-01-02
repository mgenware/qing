import { expect } from 'dev/t';
import ls from 'ls';
import { entityTypeToLS } from './strings';
import {
  entityAnswer,
  entityCmt,
  entityDiscussion,
  entityPost,
  entityQuestion,
} from 'sharedConstants';

it('entityTypeToLS', () => {
  expect(entityTypeToLS(entityAnswer)).to.eq(ls.answer);
  expect(entityTypeToLS(entityCmt)).to.eq(ls.comment);
  expect(entityTypeToLS(entityDiscussion)).to.eq(ls.discussion);
  expect(entityTypeToLS(entityPost)).to.eq(ls.post);
  expect(entityTypeToLS(entityQuestion)).to.eq(ls.question);
});
