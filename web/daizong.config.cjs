const turboBuildCmd = 'ttsc -p ./tsconfig-turbo-node.json --incremental';
const toolsCmd = 'yarn --cwd ../tools build';
const devEnv = {
  NODE_ENV: 'development',
};
const prodEnv = {
  NODE_ENV: 'production',
};

module.exports = {
  lint: {
    run: ['eslint --max-warnings 0 --ext .ts src/', 'lit-analyzer "src/**/*.ts"'],
  },

  /** Standard mode */
  dev: {
    run: ['#prepare', 'rollup -c -w'],
    env: devEnv,
  },
  build: {
    run: ['#lint', '#prepare', 'rollup -c'],
    env: prodEnv,
  },

  /** Turbo mode */
  turbo: {
    // Use `ttsc` instead of `tsc` to enable path rewriting.
    run: ['#prepare-turbo', turboBuildCmd + ' -w'],
    env: devEnv,
  },
  'turbo-build': {
    run: ['#prepare-turbo', turboBuildCmd],
    env: prodEnv,
  },

  /** UT mode */
  ut: {
    t: {
      run: 'mocha --require source-map-support/register dist/**/*.test.js',
    },
    run: ['#turbo-build', '#ut t'],
  },

  _: {
    privateTasks: {
      prepare: {
        run: [toolsCmd],
        before: {
          del: 'static/d/js',
        },
      },
      'prepare-turbo': {
        run: [toolsCmd],
        before: {
          del: 'dist',
        },
      },
    },
  },
};
