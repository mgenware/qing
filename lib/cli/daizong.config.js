export default {
  dev: {
    run: ['#clean', 'tsc -b src -w'],
    envGroups: ['development'],
  },

  build: {
    run: ['#clean', 'tsc -b src', '#lint'],
    envGroups: ['production'],
  },

  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },

  lint: {
    run: 'eslint --max-warnings 0 --ext .ts src/',
  },

  _: {
    envGroups: {
      production: {
        NODE_ENV: 'production',
      },
      development: {
        NODE_ENV: 'development',
      },
    },
  },
};
