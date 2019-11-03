import Loader from 'lib/loader';
import routes from 'routes';

export default class ListCmtLoader extends Loader<undefined> {
  constructor(public url: string) {
    super();
  }

  requestURL(): string {
    return this.url;
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
