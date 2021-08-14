const esbuild = require('esbuild');

const entryPoints = [
  'm/mEntry.ts',
  'mx/mxEntry.ts',
  'post/postEntry.ts',
  'discussion/discussionEntry.ts',
  'profile/profileEntry.ts',
  'auth/authEntry.ts',
  'home/homeStdEntry.ts',
  'home/homeFrmEntry.ts',
  'forum/forumEntry.ts',
  'forum/forumSettingsEntry.ts',
  'lang/langEntry.ts',
  'qna/questionEntry.ts',
];

esbuild
  .build({
    entryPoints,
    bundle: true,
    outdir: 'dist-es',
    define: {
      'window.__qing_dev__': true,
    },
  })
  .catch(() => process.exit(1));
