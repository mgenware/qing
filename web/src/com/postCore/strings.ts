import { CHECK } from 'checks';
import { appdef } from '@qing/def';

export function entityTypeToLS(entityType: appdef.ContentBaseType): string {
  switch (entityType) {
    case appdef.ContentBaseType.post:
      return globalThis.coreLS.post;
    case appdef.ContentBaseType.fPost:
      return globalThis.coreLS.fPost;
    case appdef.ContentBaseType.cmt:
      return globalThis.coreLS.comment;
    default: {
      CHECK(false);
      return '';
    }
  }
}
