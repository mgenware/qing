import * as mr from 'mingru';
import actions from './actions/actions';
import models from './models/models';

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory
  const builder = new mr.Builder(dialect, '../da/', {
    cleanBuild: true,
    jsonEncoding: {
      encodingStyle: mr.JSONEncodingStyle.camelCase,
      excludeEmptyValues: true,
    },
  });
  await builder.buildAsync(async () => {
    await builder.buildActionsAsync(actions);
    await builder.buildCreateTableSQLFilesAsync(models);
  });
})();
