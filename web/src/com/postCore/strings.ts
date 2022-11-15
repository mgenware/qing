import ls from 'ls';
import { CHECK } from 'checks';
import { appdef } from '@qing/def';

export function entityTypeToLS(entityType: appdef.ContentBaseType): string {
  switch (entityType) {
    case appdef.ContentBaseType.post:
      return ls.post;
    case appdef.ContentBaseType.fPost:
      return ls.fPost;
    case appdef.ContentBaseType.cmt:
      return ls.comment;
    default: {
      CHECK(false);
      return '';
    }
  }
}
