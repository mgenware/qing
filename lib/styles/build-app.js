const mk = require('makhulu');

(async () => {
  const files = new mk.DataList(
    ['modern-normalize.css', 'app.css'].map(s => ({
      [mk.fs.SrcDir]: __dirname,
      [mk.fs.RelativeFile]: s,
    })),
  );
  await files.map('Read files', mk.fs.readToString);
  await files.reset('Merge into one file', async dataList => {
    // Merged file name
    const destFile = 'main-bundle.css';
    let contents = '';
    dataList.forEach(d => {
      contents += '\n' + d[mk.fs.FileContent];
    });
    // create a new DataObject
    const bundleFileObject = {
      [mk.fs.SrcDir]: '.',
      [mk.fs.RelativeFile]: destFile,
      [mk.fs.FileContent]: contents,
    };
    return [bundleFileObject];
  });
  await files.map('Write files', mk.fs.writeToDirectory('./dist'));
  await files.forEach('Dest files', mk.fs.printsDestFile);
})();
