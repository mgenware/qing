import * as mm from 'mingru-models';
import ThreadBase from '../../models/com/threadBase';
import ContentBaseTA from './contentBaseTA';

export default abstract class ThreadBaseTA extends ContentBaseTA {
  getStartingInsertionInputColumns(): mm.Column[] {
    const t = this.getBaseTable();
    if (t instanceof ThreadBase) {
      return [t.forum_id];
    }
    throw new Error(`t is not a \`ThreadCore\`, got ${t}`);
  }
}
