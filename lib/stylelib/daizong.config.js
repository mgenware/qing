module.exports = {
  build: {
    run: [
      'concat -o dist/stylelib.css node_modules/modern-normalize/modern-normalize.css node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
      'cleancss -o dist/stylelib.min.css dist/stylelib.css',
    ],
    before: {
      mkdirDel: 'dist',
    },
  },
};
