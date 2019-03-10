import BaseLoader from '@/lib/loader';

export default class SetProfileLoader extends BaseLoader {
  constructor(
    public nick: string,
    public website: string,
    public company: string,
    public location: string,
  ) {
    super();
  }

  requestURL(): string {
    return '/sr/settings/profile/set_info';
  }

  requestParams(): object {
    const ret = {
      nick: this.nick,
      website: this.website,
      company: this.company,
      location: this.location,
    };
    return ret;
  }
}
