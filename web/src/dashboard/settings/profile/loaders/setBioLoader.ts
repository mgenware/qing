import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class SetBioLoader extends BaseLoader<undefined> {
  constructor(public bio: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.profile.setBio;
  }

  requestParams(): unknown {
    return {
      bio: this.bio,
    };
  }
}
