import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class SignInLoader extends BaseLoader<undefined> {
  constructor(public email: string, public pwd: string) {
    super();
  }

  requestURL(): string {
    return routes.s.p.auth.signIn;
  }

  requestParams(): unknown {
    const ret = {
      email: this.email,
      pwd: this.pwd,
    };
    return ret;
  }
}
