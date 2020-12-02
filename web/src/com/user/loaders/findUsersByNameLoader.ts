import { CHECK } from 'checks';
import BaseLoader from 'lib/loader';
import UserInfo from '../userInfo';
import routes from 'routes';

export default class FindUsersByNameLoader extends BaseLoader<UserInfo> {
  constructor(public name: string) {
    super();
    CHECK(name);
  }

  requestURL(): string {
    return routes.s.r.user.findByName;
  }

  requestParams(): unknown {
    return {
      name: this.name,
    };
  }
}
