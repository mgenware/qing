import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class SetLikeLoader extends BaseLoader<string> {
  constructor(public id: string | null, public liked: boolean) {
    super();
  }

  requestURL(): string {
    return routes.s.r.like.set;
  }

  requestParams(): unknown {
    return {
      id: this.id,
      value: +this.liked,
    };
  }
}
