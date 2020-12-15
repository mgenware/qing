import { promises as fsPromises } from 'fs';
import 'crash-on-errors';
import goConvert from 'go-const-gen';
import tsConvert from 'json-to-js-const';

async function buildJSONFileAsync(
  src: string,
  webDest: string,
  serverDest: string,
  packageName: string,
  typeName: string,
  variableName: string,
) {
  const json = await fsPromises.readFile(src, 'utf8');

  const jsonObj = JSON.parse(json);
  const goResult = await goConvert(jsonObj, {
    packageName,
    typeName,
    variableName,
    hideJSONTags: true,
    disablePropertyFormatting: true,
  });
  const tsResult = tsConvert(jsonObj);

  await Promise.all([
    fsPromises.writeFile(serverDest, goResult),
    fsPromises.writeFile(webDest, tsResult),
  ]);
}

async function buildSharedConstantsAsync() {
  return buildJSONFileAsync(
    '../web/src/app/shared_constants.json',
    '../web/src/sharedConstants.ts',
    '../server/app/defs/shared_constants.go',
    'defs',
    'SharedConstantsType',
    'Shared',
  );
}

async function buildDBConstantsAsync() {
  return buildJSONFileAsync(
    '../server/mingru/src/constants.json',
    '../web/src/dbConstants.ts',
    '../server/app/defs/db_constants.go',
    'defs',
    'DBConstantsType',
    'DB',
  );
}

(async () => {
  await Promise.all([buildSharedConstantsAsync(), buildDBConstantsAsync()]);
})();
