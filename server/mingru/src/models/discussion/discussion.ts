import * as mm from 'mingru-models';
import ThreadBase from '../com/threadBase';

export class Discussion extends ThreadBase {
  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(Discussion);
