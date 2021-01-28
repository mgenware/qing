import Loader from 'lib/loader';
import UserInfo from 'com/user/userInfo';
import routes from 'routes';

export default class GetAdminsLoader extends Loader<UserInfo[]> {
  requestURL(): string {
    return routes.s.admin.getAdmins;
  }
}
