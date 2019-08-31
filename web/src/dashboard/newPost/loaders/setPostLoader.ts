import BaseLoader from 'lib/loader';
import ComposerPayload from 'ui/editor/composerPayload';
import routes from 'routes';

export default class SetPostLoader extends BaseLoader {
  constructor(public tid: string | null, public payload: ComposerPayload) {
    super();
  }

  requestURL(): string {
    return routes.sr.compose.setPost;
  }

  requestParams(): object {
    return {
      ...this.payload,
      tid: this.tid,
    };
  }
}
