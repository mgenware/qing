import Loader from 'lib/loader';
import routes from 'routes';

export interface GetForumEditingInfo {
  name?: string;
  descHTML?: string;
}

export class GetForumEditingInfoLoader extends Loader<GetForumEditingInfo> {
  constructor(public fid: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.forum.fmod.getInfo;
  }

  requestParams(): unknown {
    return {
      id: this.fid,
    };
  }
}
