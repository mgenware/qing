const turboBuildCmd = 'ttsc -p ./tsconfig-turbo-node.json --incremental';
const utCmd = 'web-test-runner "./dist/src/**/*.test.js" --node-resolve';
const prebuildCmd = '#prebuild';
const devEnv = {
  NODE_ENV: 'development',
};
const prodEnv = {
  NODE_ENV: 'production',
};
const prebuildDirName = 'prebuild';

const prebuildTasks = ['build-ls-go-defs', 'build-ls', 'build-shared-const'].map(
  (s) => `node ./${prebuildDirName}/dist/${s}.js`,
);

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

  /** UT */
  ut: {
    t: {
      run: utCmd,
    },
    tw: {
      run: utCmd + ' --watch',
    },
    run: ['#turbo-build', '#ut t'],
  },

  /** Prebuild */
  prebuild: {
    build: {
      run: `tsc -p ./${prebuildDirName} --incremental`,
    },
    runTasks: {
      run: prebuildTasks,
      parallel: true,
    },
    run: ['#prebuild build', '#prebuild runTasks'],
  },

  _: {
    privateTasks: {
      prepare: {
        run: prebuildCmd,
        before: {
          del: 'static/d/js',
        },
      },
      'prepare-turbo': {
        run: prebuildCmd,
        before: {
          del: 'dist',
        },
      },
    },
  },
};
