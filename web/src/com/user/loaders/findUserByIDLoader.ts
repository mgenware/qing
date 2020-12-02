import { CHECK } from 'checks';
import BaseLoader from 'lib/loader';
import UserInfo from '../userInfo';
import routes from 'routes';

export default class FindUserByIDLoader extends BaseLoader<UserInfo> {
  constructor(public id: string) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return routes.s.r.user.findByID;
  }

  requestParams(): unknown {
    return {
      id: this.id,
    };
  }
}
