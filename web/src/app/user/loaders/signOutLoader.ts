import Loader from 'lib/loader';
import routes from 'routes';

export default class SignOutLoader extends Loader<undefined> {
  requestURL(): string {
    return routes.s.pri.auth.signOut;
  }
}
