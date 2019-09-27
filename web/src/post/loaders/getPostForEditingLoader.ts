import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface GetPostForEditingResult {
  Title: string;
  Content: string;
}

export class GetPostForEditingLoader extends BaseLoader<
  GetPostForEditingResult
> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.sr.compose.getPostForEditing;
  }

  requestParams(): object {
    return {
      id: this.id,
    };
  }
}
