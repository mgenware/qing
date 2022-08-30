export default {
  build: {
    alias: 'b',
    run: [
      'concat -o dist/stylelib.css node_modules/modern-normalize/modern-normalize.css extra.css',
      'cleancss -o dist/main.min.css dist/stylelib.css',
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
