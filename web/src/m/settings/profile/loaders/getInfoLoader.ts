import Loader from 'lib/loader';

export default class GetInfoLoader extends Loader {
  requestURL(): string {
    return '/sr/settings/profile/get_info';
  }
}
