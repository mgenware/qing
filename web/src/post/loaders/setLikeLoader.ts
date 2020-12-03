import BaseLoader from 'lib/loader';
import routes from 'routes';
import { CHECK } from 'checks';
import LikeHostType from './likeHostType';

export default class SetLikeLoader extends BaseLoader<string> {
  constructor(public id: string, public type: LikeHostType, public liked: boolean) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return routes.s.pri.like.set;
  }

  requestParams(): unknown {
    return {
      id: this.id,
      value: +this.liked,
      type: +this.type,
    };
  }
}
