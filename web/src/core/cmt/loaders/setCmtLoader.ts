import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';
import { EntityType } from 'lib/entity';
import Cmt from '../cmt';

export interface SetCmtResponse {
  cmt: Cmt;
}

export default class SetCmtLoader extends BaseLoader<SetCmtResponse> {
  static newCmt(
    postID: string,
    entityType: EntityType,
    payload: ComposerContent,
  ) {
    return new SetCmtLoader(null, postID, entityType, payload);
  }

  static editCmt(cmtID: string, payload: ComposerContent) {
    return new SetCmtLoader(cmtID, null, null, payload);
  }

  private constructor(
    public id: string | null,
    public postID: string | null,
    public entityType: EntityType | null,
    public payload: ComposerContent,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.setCmt;
  }

  requestParams(): object {
    const params: any = {
      ...this.payload,
      id: this.id,
      postID: this.postID,
      entityType: this.entityType,
    };
    return params;
  }
}
