module.exports = {
  kangxi: {
    run: [
      'postcss node_modules/kangxi-editor/dist/editor.css > dist/kangxi-min.css',
      'css-to-lit-js ./dist/kangxi-min.css -ext ts --outdir ../../web/src/app/styles',
    ],
    before: {
      mkdir: 'dist',
    },
  },
  libs: {
    run: [
      'concat -o dist/libs.css ext/modern-normalize.css ext/bootstrap-grid.min.css node_modules/kangxi-editor/dist/editor.css',
      'postcss dist/libs.css > dist/libs-min.css && css-to-lit-js dist/libs-min.css -ext ts --outdir ../../web/src/app/styles',
    ],
  },
  build: {
    run: ['#kangxi', '#libs'],
    before: {
      del: 'dist',
    },
  },
};
