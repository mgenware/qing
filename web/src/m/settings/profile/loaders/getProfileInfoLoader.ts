import Loader from 'lib/loader';
import routes from 'routes';

export interface GetProfileInfoResult {
  iconURL?: string;
  name?: string;
  website?: string;
  company?: string;
  location?: string;
  bio?: string;
}

export class GetProfileInfoLoader extends Loader<GetProfileInfoResult> {
  requestURL(): string {
    return routes.s.pri.profile.getInfo;
  }
}
