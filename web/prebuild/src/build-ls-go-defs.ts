import { promises as fsPromises } from 'fs';
import gen from '../../node_modules/go-const-gen/dist/main.js';
import { serverPath, webPath } from './paths.js';

(async () => {
  // Read the contents of a localized JSON.
  const json = await fsPromises.readFile(webPath('/langs/en.json'), 'utf8');
  const result = await gen(JSON.parse(json), {
    packageName: 'localization',
    typeName: 'Dictionary',
    parseFunc: true,
  });

  await fsPromises.writeFile(serverPath('/app/handler/localization/dictionary.go'), result);
})();
