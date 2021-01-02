import Loader from 'lib/loader';
import routes from 'routes';

export default class CreateNewUserLoader extends Loader<undefined> {
  constructor(public name: string, public email: string, public pwd: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pub.auth.createNewUser;
  }

  requestParams(): Record<string, unknown> {
    return {
      name: this.name,
      email: this.email,
      pwd: this.pwd,
    };
  }
}
