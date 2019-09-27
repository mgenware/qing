import Loader from 'lib/loader';
import routes from 'routes';

export interface GetProfileInfoResult {
  URLName?: string;
  IconURL?: string;
  Name?: string;
  Website?: string;
  Company?: string;
  Location?: string;
  Bio?: string;
  BioSrc?: string;
}

export class GetProfileInfoLoader extends Loader<GetProfileInfoResult> {
  requestURL(): string {
    return routes.sr.profile.getInfo;
  }
}
