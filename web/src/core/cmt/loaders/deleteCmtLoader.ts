import BaseLoader from 'lib/loader';
import routes from 'routes';
import { EntityType } from 'lib/entity';

export default class DeleteCmtLoader extends BaseLoader<string> {
  constructor(public id: string | null, public hostType: EntityType) {
    super();
  }

  requestURL(): string {
    return routes.s.r.compose.deleteCmt;
  }

  requestParams(): object {
    return {
      id: this.id,
      hostType: this.hostType,
    };
  }
}
