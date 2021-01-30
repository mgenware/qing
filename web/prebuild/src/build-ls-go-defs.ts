import { promises as fsPromises } from 'fs';
import gen from 'go-const-gen';
import { serverPath, webPath } from './paths';

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
