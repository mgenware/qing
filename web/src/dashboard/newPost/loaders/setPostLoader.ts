import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerPayload } from 'ui/editor/composerView';

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
