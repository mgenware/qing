import BaseLoader from 'lib/loader';
import routes from 'routes';
import { CHECK } from 'checks';
import LikeHostType from './likeHostType';

export default class GetLikeLoader extends BaseLoader<string> {
  constructor(public id: string, public type: LikeHostType) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return routes.s.r.like.set;
  }

  requestParams(): unknown {
    return {
      id: this.id,
      type: +this.type,
    };
  }
}
