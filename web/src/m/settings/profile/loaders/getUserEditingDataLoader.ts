import BaseLoader from '@/lib/loader';

export default class GetUserEditingDataLoader extends BaseLoader {
  requestURL(): string {
    return '/sr/settings/profile/get_info';
  }
}
