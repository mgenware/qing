import BaseLoader from 'lib/loader';
import routes from 'routes';
import { entityThreadMsg } from 'sharedConstants';
import { ComposerContent } from 'ui/editor/composerView';

export class SetPostLoader extends BaseLoader<string> {
  // Used when `entityType` is `threadMsg`;
  threadID?: string;

  constructor(
    public id: string | null,
    public content: ComposerContent,
    public entityType: number,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.setPost;
  }

  requestParams(): unknown {
    const { entityType } = this;
    const params: Record<string, unknown> = {
      content: this.content,
      entityType,
    };
    if (this.id) {
      params.id = this.id;
    }
    if (entityType === entityThreadMsg) {
      if (!this.threadID) {
        throw new Error('`threadID` is required when `entityType` is thread msg');
      }
      params.threadID = this.threadID;
    }
    return params;
  }
}
