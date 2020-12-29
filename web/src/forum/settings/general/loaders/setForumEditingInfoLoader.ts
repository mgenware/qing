import BaseLoader from 'lib/loader';
import routes from 'routes';

export default class SetForumEditingInfoLoader extends BaseLoader<undefined> {
  constructor(public fid: string, public name: string, public descHTML: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.forum.fmod.setInfo;
  }

  requestParams(): unknown {
    return {
      id: this.fid,
      name: this.name,
      desc: this.descHTML,
    };
  }
}
