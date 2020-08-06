import BaseLoader from 'lib/loader';
import routes from 'routes';
import { CHECK } from 'checks';

export enum LikeHostType {
  post = 0,
}

export default class SetLikeLoader extends BaseLoader<string> {
  constructor(
    public id: string,
    public type: LikeHostType,
    public liked: boolean,
  ) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return routes.s.r.like.set;
  }

  requestParams(): unknown {
    return {
      id: this.id,
      value: +this.liked,
      type: +this.type,
    };
  }
}
