import BaseLoader from 'lib/loader';
import UserInfo from 'com/user/userInfo';
import routes from 'routes';

export default class GetAdminsLoader extends BaseLoader<UserInfo[]> {
  requestURL(): string {
    return routes.s.admin.getAdmins;
  }
}
