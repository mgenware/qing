const config = {
  forbidOnly: !!process.env.CI,
  testDir: 'dist/br/',
  testMatch: '*.test.js',
};

module.exports = config;
