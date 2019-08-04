import Loader from 'lib/loader';

export default class SetInfoLoader extends Loader {
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
