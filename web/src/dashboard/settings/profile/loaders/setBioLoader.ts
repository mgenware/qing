import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class SetBioLoader extends BaseLoader<void> {
  constructor(public bio: string) {
    super();
  }

  requestURL(): string {
    return routes.s.r.profile.setBio;
  }

  requestParams(): unknown {
    const ret = {
      bio: this.bio,
    };
    return ret;
  }
}
