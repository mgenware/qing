import { promises as fsPromises } from 'fs';
import 'crash-on-errors';
import goConvert from 'go-const-gen';
import tsConvert from 'json-to-js-const';

(async () => {
  // Read the contents of a localized JSON.
  const json = await fsPromises.readFile('../web/src/app/shared_const.json', 'utf8');

  const jsonObj = JSON.parse(json);
  const goResult = await goConvert(jsonObj, {
    packageName: 'defs',
    typeName: 'SharedConstants',
    variableName: 'Constants',
    hideJSONTags: true,
  });
  const tsResult = tsConvert(jsonObj);

  await fsPromises.writeFile('../server/app/defs/shared_const.go', goResult);
  await fsPromises.writeFile('../web/src/app/sharedConstants.ts', tsResult);
})();
