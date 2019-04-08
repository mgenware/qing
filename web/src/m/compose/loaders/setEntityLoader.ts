import BaseLoader from '@/lib/loader';
import ComposerPayload from '@/ui/editor/composerPayload';

export default class SetEntityLoader extends BaseLoader {
  constructor(
    public isNew: boolean,
    public type: string,
    public payload: ComposerPayload,
  ) {
    super();
  }

  requestURL(): string {
    return '/sr/compose/add';
  }

  requestParams(): object {
    const { payload } = this;
    const ret: any = {
      type: this.type,
      content: payload.content,
    };
    if (payload.title) {
      ret.title = payload.title;
    }
    return ret;
  }
}
