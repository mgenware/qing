import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';

export default class SetPostLoader extends BaseLoader<string> {
  constructor(public id: string | null, public payload: ComposerContent) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.setPost;
  }

  requestParams(): object {
    const params: any = {
      ...this.payload,
    };
    if (this.id) {
      params.id = this.id;
    }
    return params;
  }
}
