import BaseLoader from 'lib/loader';
import routes from 'routes';
import { ComposerContent } from 'ui/editor/composerView';

export interface SetPostConfig {
  destination: number;
  type: number;

  // Applies to forum.
  forumID?: string;
}

export class SetPostLoader extends BaseLoader<string> {
  constructor(
    public id: string | null,
    public content: ComposerContent,
    public config: SetPostConfig,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.setPost;
  }

  requestParams(): unknown {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      content: this.content,
      ...this.config,
    };
    if (this.id) {
      params.id = this.id;
    }
    return params;
  }
}
