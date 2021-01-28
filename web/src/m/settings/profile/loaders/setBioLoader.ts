import Loader from 'lib/loader';
import routes from 'routes';

export default class SetBioLoader extends Loader<undefined> {
  constructor(public bio: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.profile.setBio;
  }

  requestParams(): Record<string, unknown> {
    return {
      bio: this.bio,
    };
  }
}
