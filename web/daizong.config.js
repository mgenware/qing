module.exports = {
  prepare: {
    run: ['yarn --cwd ../tools build'],
    before: {
      del: 'static/d/js',
    },
  },
  'prepare-turbo': {
    run: ['yarn --cwd ../tools build'],
    before: {
      del: 'dist',
    },
  },
  lint: {
    run: ['eslint --max-warnings 0 --ext .ts src/', 'lit-analyzer "src/**/*.ts"'],
  },
  dev: {
    run: ['#prepare', 'rollup -c -w'],
    env: {
      NODE_ENV: 'development',
    },
  },
  turbo: {
    run: ['#prepare-turbo', 'ttsc -p tsconfig-turbo.json -w --incremental'],
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
      run: ['#cleanTests', 'tsc --project ./ut/tsconfig.json --incremental -w'],
    },
    t: {
      run: 'mocha --require source-map-support/register dist_test/ut/ut/**/*.test.js',
    },
    run: ['#cleanTests', 'tsc --project ./ut/tsconfig.json', '#ut t'],
  },
  cleanTests: {
    run: {
      del: 'dist_tests',
    },
  },
};
