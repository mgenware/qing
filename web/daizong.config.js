module.exports = {
  prepare: {
    run: ['yarn --cwd ../tools build', 'rimraf static/d/js'],
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
};
