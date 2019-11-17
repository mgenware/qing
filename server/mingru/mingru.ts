import * as mr from 'mingru';
import actions from './actions';
import tables from './tables';

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory
  const builder = new mr.Builder(dialect, '../da/', {
    cleanBuild: true,
    memberJSONKeyStyle: mr.MemberJSONKeyStyle.camelCase,
  });
  await builder.buildAsync(async () => {
    await builder.buildActionsAsync(actions);
    await builder.buildCreateTableSQLFilesAsync(tables);
  });
})();
