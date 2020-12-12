import * as mr from 'mingru';
import * as nodepath from 'path';
import gen from 'go-const-gen';
import { promises as fsPromises } from 'fs';
import actions from './actions/actions';
import models from './models/models';
import defs from './actions/defs';

const packageName = 'da';

async function buildConstantsAsync(path: string) {
  const goCode = await gen(defs, {
    packageName,
    typeName: 'SharedConstants',
    variableName: 'Constants',
    hideJSONTags: true,
    disablePropertyFormatting: true,
  });

  await fsPromises.writeFile(path, goCode);
}

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory
  const daPath = nodepath.join(__dirname, `../../${packageName}/`);
  const builder = new mr.Builder(dialect, daPath, {
    cleanBuild: true,
    jsonEncoding: {
      encodingStyle: mr.JSONEncodingStyle.camelCase,
      excludeEmptyValues: true,
    },
  });
  await builder.buildAsync(async () => {
    Promise.all([
      await builder.buildActionsAsync(actions),
      await builder.buildCreateTableSQLFilesAsync(models),
    ]);
  });
  // Build `constants.go`.
  await buildConstantsAsync(nodepath.join(daPath, 'constants.go'));
})();
