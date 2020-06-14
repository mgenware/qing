module.exports = {
  prepare: {
    run: ['yarn --cwd ../tools build'],
    after: {
      del: 'static/d/js',
    },
  },
  lint: {
    run: ['eslint --ext .ts src/', 'lit-analyzer "src/**/*.ts"'],
  },
  dev: {
    run: ['#prepare', 'rollup -c -w'],
    env: {
      NODE_ENV: 'development',
    },
  },
  build: {
    run: ['#lint', '#prepare', 'rollup -c'],
    env: {
      NODE_ENV: 'production',
    },
  },
  // Unit tests
  ut: {
    dev: {
      run: ['tsc --project ./ut/tsconfig.json --incremental -w'],
      before: {
        del: 'dist',
      },
    },
    t: {
      run:
        'mocha --require source-map-support/register dist/ut/ut/**/*.test.js',
    },
    run: ['tsc --project ./ut/tsconfig.json', '#ut t'],
    before: {
      del: 'dist',
    },
  },
};
