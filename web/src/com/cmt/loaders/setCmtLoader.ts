import { CHECK } from 'checks';
import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';
import Cmt from '../cmt';

export interface SetCmtData {
  // Always required.
  hostID: string;
  hostType: number;
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
  static newCmt(hostID: string, hostType: number, contentData: ComposerContent): SetCmtLoader {
    return new SetCmtLoader({
      hostID,
      hostType,
      contentData,
    });
  }

  static editCmt(
    hostID: string,
    hostType: number,
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
    hostType: number,
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

    CHECK(data.hostID);
    CHECK(data.hostType);
  }

  requestURL(): string {
    return routes.s.pri.compose.setCmt;
  }

  requestParams(): unknown {
    return this.data;
  }
}
