import { CHECK } from 'checks.js';
import { frozenDef } from '@qing/def';

export function entityTypeToLS(entityType: frozenDef.ContentBaseType): string {
  switch (entityType) {
    case frozenDef.ContentBaseType.post:
      return globalThis.coreLS.post;
    case frozenDef.ContentBaseType.fPost:
      return globalThis.coreLS.fPost;
    case frozenDef.ContentBaseType.cmt:
      return globalThis.coreLS.comment;
    default: {
      CHECK(false);
      return '';
    }
  }
}
