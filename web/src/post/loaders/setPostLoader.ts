import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerPayload } from 'ui/editor/composerView';

export default class SetPostLoader extends BaseLoader<string> {
  constructor(public id: string | null, public payload: ComposerPayload) {
    super();
  }

  requestURL(): string {
    return routes.sr.compose.setPost;
  }

  requestParams(): object {
    return {
      ...this.payload,
      id: this.id,
    };
  }
}
