import * as mr from 'mingru';
import actions from './actions';

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory
  await mr.build(actions, dialect, '../da/', { cleanBuild: true });
})();
