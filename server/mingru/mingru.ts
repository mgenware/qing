import * as mr from 'mingru';
import actions from './actions';
import tables from './tables';

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory
  const builder = new mr.Builder(dialect, '../da/', {
    cleanBuild: true,
  });
  await builder.build(async () => {
    builder.buildActions(actions);
    builder.buildCreateTableSQLFiles(tables);
  });
})();
