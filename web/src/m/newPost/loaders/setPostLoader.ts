import BaseLoader from 'lib/loader';
import ComposerPayload from 'ui/editor/composerPayload';

export default class SetPostLoader extends BaseLoader {
  constructor(public tid: string | null, public payload: ComposerPayload) {
    super();
  }

  requestURL(): string {
    return '/sr/compose/set-post';
  }

  requestParams(): object {
    return {
      ...this.payload,
      tid: this.tid,
    };
  }
}
