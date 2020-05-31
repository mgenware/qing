import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';
import { EntityType } from 'lib/entity';
import Cmt from '../cmt';

export interface SetCmtData {
  // Always required.
  hostID: string;
  hostType: EntityType;
  contentData: ComposerContent;
  // Only needed when editing a cmt or reply.
  id?: string;
  // Only needed when creating a reply.
  toUserID?: string;
  parentCmtID?: string;
}

export interface SetCmtResponse {
  cmt: Cmt;
}

export default class SetCmtLoader extends BaseLoader<SetCmtResponse> {
  static newCmt(
    hostID: string,
    hostType: EntityType,
    contentData: ComposerContent,
  ): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      contentData,
    });
  }

  static editCmt(
    hostID: string,
    hostType: EntityType,
    id: string,
    contentData: ComposerContent,
  ): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      contentData,
      id,
    });
  }

  static newReply(
    hostID: string,
    hostType: EntityType,
    toUserID: string,
    parentCmtID: string,
    contentData: ComposerContent,
  ): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      toUserID,
      parentCmtID,
      contentData,
    });
  }

  private constructor(public data: SetCmtData) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.setCmt;
  }

  requestParams(): unknown {
    return this.data;
  }
}
