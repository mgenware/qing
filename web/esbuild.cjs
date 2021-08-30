const esbuild = require('esbuild');

const entryPoints = [
  'core',
  'm/mEntry',
  'mx/mxEntry',
  'post/postEntry',
  'discussion/discussionEntry',
  'profile/profileEntry',
  'auth/authEntry',
  'home/homeStdEntry',
  'home/homeFrmEntry',
  'forum/forumEntry',
  'forum/forumSettingsEntry',
  'lang/langEntry',
  'qna/questionEntry',
  'devPage/devPageEntry',
].map((s) => `dist/${s}.js`);

esbuild
  .build({
    entryPoints,
    bundle: true,
    outdir: '../userland/static/g/app',
    define: {
      'window.__qing_dev__': true,
    },
  })
  .catch(() => process.exit(1));
