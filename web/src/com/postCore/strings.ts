import ls from 'ls';
import { CHECK } from 'checks';
import { appdef } from '@qing/def';

export function entityTypeToLS(entityType: number): string {
  switch (entityType) {
    case appdef.contentBaseTypePost:
      return ls.post;
    case appdef.contentBaseTypeThread:
      return ls.thread;
    case appdef.contentBaseTypeCmt:
      return ls.comment;
    default: {
      CHECK(false);
      return '';
    }
  }
}
