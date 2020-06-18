module.exports = {
  concat: {
    run: [
      'concat -o dist/stylelib.css node_modules/modern-normalize/modern-normalize.css node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
      'postcss dist/stylelib.css > dist/stylelib.min.css',
    ],
  },
  build: {
    run: ['#kangxi', '#concat'],
    before: {
      del: 'dist',
    },
  },
};
