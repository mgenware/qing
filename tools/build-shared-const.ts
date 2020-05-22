import { promises as fsPromises } from 'fs';
import 'crash-on-errors';
import gen from 'go-const-gen';

(async () => {
  // Read the contents of a localized JSON.
  const json = await fsPromises.readFile(
    '../web/src/app/shared_const.json',
    'utf8',
  );
  const result = await gen(JSON.parse(json), {
    packageName: 'app',
    typeName: 'SharedConstants',
    variableName: 'Constants',
  });

  await fsPromises.writeFile('../server/app/shared_const.go', result);
})();
