import {
  getImportMapFromNodeModules,
  generateImportMapForProject,
} from '@jsenv/node-module-import-map';

const projectDirectoryUrl = new URL('./', import.meta.url);

await generateImportMapForProject(
  [
    getImportMapFromNodeModules({
      projectDirectoryUrl,
      projectPackageDevDependenciesIncluded: false,
    }),
  ],
  {
    projectDirectoryUrl,
    importMapFileRelativeUrl: './qing.importmap',
  },
);
