import { promises as fsPromises } from 'fs';
import goConvert from '../../node_modules/go-const-gen/dist/main.js';
import tsConvert from '../../node_modules/json-to-js-const/dist/main.js';
import { serverPath, webPath } from './paths.js';

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
    webPath('/src/app/shared_constants.json'),
    webPath('/src/sharedConstants.ts'),
    serverPath('/app/defs/shared_constants.go'),
    'defs',
    'SharedConstantsType',
    'Shared',
  );
}

async function buildDBConstantsAsync() {
  return buildJSONFileAsync(
    serverPath('/mingru/src/constants.json'),
    webPath('/src/dbConstants.ts'),
    serverPath('/app/defs/db_constants.go'),
    'defs',
    'DBConstantsType',
    'DB',
  );
}

(async () => {
  await Promise.all([buildSharedConstantsAsync(), buildDBConstantsAsync()]);
})();
