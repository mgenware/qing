import BaseLoader from 'lib/loader';
import UserInfo from 'com/user/userInfo';
import routes from 'routes';
import { CHECK } from 'checks';

export default class SetAdminLoader extends BaseLoader<UserInfo[]> {
  constructor(public targetUser: string, public value: boolean) {
    super();
    CHECK(targetUser);
  }

  requestURL(): string {
    return routes.s.admin.setAdmin;
  }

  requestParams(): unknown {
    return {
      target_user_id: this.targetUser,
      value: +this.value,
    };
  }
}
