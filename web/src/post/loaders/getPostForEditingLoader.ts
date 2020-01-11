import BaseLoader from 'lib/loader';
import routes from 'routes';

export interface GetPostForEditingResult {
  title: string;
  content: string;
}

export class GetPostForEditingLoader extends BaseLoader<
  GetPostForEditingResult
> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.getPostForEditing;
  }

  requestParams(): object {
    return {
      id: this.id,
    };
  }
}
