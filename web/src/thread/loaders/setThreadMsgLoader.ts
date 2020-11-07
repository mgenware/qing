import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';

export class SetThreadMsgLoader extends BaseLoader<string> {
  constructor(public id: string | null, public content: ComposerContent) {
    super();
  }

  requestURL(): string {
    return routes.s.r.thread.setThreadMsg;
  }

  requestParams(): unknown {
    const params: Record<string, unknown> = {
      content: this.content,
    };
    if (this.id) {
      params.id = this.id;
    }
    return params;
  }
}
