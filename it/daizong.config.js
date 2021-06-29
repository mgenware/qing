export default {
  lint: {
    run: 'eslint --max-warnings 0 --ext .ts .',
  },
  dev: {
    run: 'ttsc -p . -w',
    before: {
      del: 'dist',
    },
  },
  api: {
    run: 'node -r source-map-support/register dist/api/run.js',
  },
  br: {
    run: 'node -r source-map-support/register dist/br/run.js',
  },
  all: {
    run: ['#api', '#br'],
  },
};
