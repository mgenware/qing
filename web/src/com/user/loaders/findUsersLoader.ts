import { CHECK } from 'checks';
import BaseLoader from 'lib/loader';
import UserInfo from '../userInfo';
import routes from 'routes';

export default class FindUsersLoader extends BaseLoader<UserInfo[]> {
  constructor(public byID: boolean, public value: string) {
    super();
    CHECK(value);
  }

  requestURL(): string {
    return routes.s.pri.user.findUsers;
  }

  requestParams(): unknown {
    return {
      byID: +this.byID,
      value: this.value,
    };
  }
}
