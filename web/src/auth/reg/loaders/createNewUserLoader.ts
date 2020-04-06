import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class CreateNewUserLoader extends BaseLoader<undefined> {
  constructor(public name: string, public email: string, public pwd: string) {
    super();
  }

  requestURL(): string {
    return routes.s.p.auth.createNewUser;
  }

  requestParams(): object {
    const ret = {
      name: this.name,
      email: this.email,
      pwd: this.pwd,
    };
    return ret;
  }
}
