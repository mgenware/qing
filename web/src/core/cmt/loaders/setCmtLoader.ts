import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerPayload } from 'ui/editor/composerView';
import { EntityType } from 'lib/entity';
import Cmt from '../cmt';

export interface SetCmtResponse {
  cmt: Cmt;
}

export default class SetCmtLoader extends BaseLoader<SetCmtResponse> {
  static newCmt(
    entityID: string,
    entityType: EntityType,
    payload: ComposerPayload,
  ) {
    return new SetCmtLoader(entityID, entityType, payload);
  }

  static editCmt(cmtID: string, payload: ComposerPayload) {
    return new SetCmtLoader(cmtID, null, payload);
  }

  private constructor(
    public id: string,
    public entityType: EntityType | null,
    public payload: ComposerPayload,
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
    };
    if (this.entityType) {
      params.entityType = this.entityType;
    }
    return params;
  }
}
