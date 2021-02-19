module.exports = {
  build: {
    run: [
      'concat -o dist/stylelib.css node_modules/modern-normalize/modern-normalize.css node_modules/bootstrap/dist/css/bootstrap-grid.min.css node_modules/kangxi-editor/dist/editor.css',
      'cleancss -o dist/main.min.css dist/stylelib.css',
      'node jsfy.js',
    ],
    before: {
      mkdirDel: 'dist',
    },
    after: {
      del: 'dist/stylelib.css',
    },
  },
};
