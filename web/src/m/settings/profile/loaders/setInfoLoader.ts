import Loader from 'lib/loader';
import routes from 'routes';

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
    return routes.sr.profile.setInfo;
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
