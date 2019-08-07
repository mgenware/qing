import Loader from 'lib/loader';
import routes from 'routes';

export default class GetInfoLoader extends Loader {
  requestURL(): string {
    return routes.sr.profile.getInfo;
  }
}
