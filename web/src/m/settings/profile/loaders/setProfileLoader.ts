import BaseLoader from '@/lib/loader';

export default class SetProfileLoader extends BaseLoader {
  constructor(
    public name: string,
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
      name: this.name,
      website: this.website,
      company: this.company,
      location: this.location,
    };
    return ret;
  }
}
