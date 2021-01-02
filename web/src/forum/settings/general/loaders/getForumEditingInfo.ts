import routes from 'routes';
import FModBaseLoader from './fmodBaseLoader';

export interface GetForumEditingInfo {
  name?: string;
  descHTML?: string;
}

export class GetForumEditingInfoLoader extends FModBaseLoader<GetForumEditingInfo> {
  requestURL(): string {
    return routes.s.pri.forum.fmod.getInfo;
  }
}
