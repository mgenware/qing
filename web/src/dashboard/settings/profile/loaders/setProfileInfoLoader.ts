import Loader from 'lib/loader';
import routes from 'routes';

export default class SetProfileInfoLoader extends Loader<undefined> {
  constructor(
    public name: string,
    public website: string,
    public company: string,
    public location: string,
  ) {
    super();
  }

  requestURL(): string {
    return routes.s.r.profile.setInfo;
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
