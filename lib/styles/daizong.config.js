module.exports = {
  navbar: {
    run: [
      'node-sass --output-style compressed bulma.sass dist/navbar-min.css',
      'css-to-lit-js ./dist/navbar-min.css -ext ts --outdir ../../web/src/app/styles',
    ],
  },
  kangxi: {
    run: [
      'postcss node_modules/kangxi-editor/dist/editor.css > dist/kangxi-min.css',
      'css-to-lit-js ./dist/kangxi-min.css -ext ts --outdir ../../web/src/app/styles',
    ],
  },
  libs: {
    run: [
      'concat -o dist/libs.css ext/modern-normalize.css ext/bootstrap-grid.min.css node_modules/kangxi-editor/dist/editor.css',
      'postcss dist/libs.css > dist/libs-min.css && css-to-lit-js dist/libs-min.css -ext ts --outdir ../../web/src/app/styles',
    ],
  },
  build: {
    run: ['rimraf ./dist', '#buildCore'],
  },
  buildCore: {
    run: ['#navbar', '#kangxi', '#libs'],
  },
};
