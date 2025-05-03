export default {
  build: {
    alias: 'b',
    run: [
      'concat -o dist/stylelib.css node_modules/modern-normalize/modern-normalize.css styles.css',
      'lightningcss --minify --bundle --targets ">= 0.25%" dist/stylelib.css -o dist/main.min.css',
      'node jsfy.js',
    ],
    before: '#cleanDist',
    after: '#cleanCSSOut',
  },
  cleanDist: {
    run: {
      mkdirDel: 'dist',
    },
  },
  cleanCSSOut: {
    run: {
      del: 'dist/stylelib.css',
    },
  },
};
