// Build type definitions for `src/ls.ts`.

const fs = require('fs').promises;

(async () => {
  const lsString = await fs.readFile('./langs/en.json', 'utf8');
  const lsObj = JSON.parse(lsString);
  let out = `export default interface LSDefs {\n`;
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await fs.writeFile('./src/lsDefs.ts', out);
})();
