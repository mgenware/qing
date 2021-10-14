import ls from 'ls';
import { CHECK } from 'checks';
import {
  entityAnswer,
  entityCmt,
  entityDiscussion,
  entityPost,
  entityQuestion,
} from 'sharedConstants';

export function entityTypeToLS(entityType: number): string {
  switch (entityType) {
    case entityPost:
      return ls.post;
    case entityQuestion:
      return ls.question;
    case entityAnswer:
      return ls.answer;
    case entityCmt:
      return ls.comment;
    case entityDiscussion:
      return ls.discussion;
    default: {
      CHECK(false);
    }
  }
}
