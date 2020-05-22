import { promises as fsPromises } from 'fs';
import 'crash-on-errors';
import gen from 'go-const-gen';

(async () => {
  // Read the contents of a localized JSON.
  const json = await fsPromises.readFile('../web/langs/en.json', 'utf8');
  const result = await gen(JSON.parse(json), {
    packageName: 'localization',
    typeName: 'Dictionary',
    parseFunc: true,
  });

  await fsPromises.writeFile(
    '../server/app/handler/localization/dictionary.go',
    result,
  );
})();
