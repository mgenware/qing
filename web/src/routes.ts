/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import buildTree from 'fx214';

export default buildTree({
  // Management APIs.
  m: {
    yourPosts: 'your-posts',
    yourDiscussions: 'your-discussions',
    yourQuestions: 'your-questions',
    settings: {
      profile: '',
    },
  },
  // Service APIs.
  s: {
    pri: {
      profile: {
        getInfo: 'get-info',
        setInfo: 'set-info',
        setAvatar: 'set-avatar',
      },
      compose: {
        setEntity: 'set-entity',
        deleteEntity: 'delete-entity',
        getEntitySource: 'get-entity-src',
        setCmt: 'set-cmt',
        deleteCmt: 'delete-cmt',
      },
      auth: {
        signOut: 'signout',
      },
      like: {
        set: '',
      },
      vote: {
        vote: '',
      },
      // My posts.
      mp: {
        posts: 'posts',
        discussions: 'discussions',
        questions: 'questions',
      },
      user: {
        findUsers: 'find-users',
      },
      forum: {
        fmod: {
          getInfo: 'get-info',
          setInfo: 'set-info',
        },
      },
    },
    pub: {
      cmt: {
        get: '',
      },
      auth: {
        createNewUser: 'create-pwd-user',
        signIn: 'signin',
      },
    },
    admin: {
      setAdmin: 'set-admin',
      getAdmins: 'get-admins',
      getSiteSettings: 'get-site-settings',
      updateSiteSettings: 'update-site-settings',
    },
  },
  auth: {
    signUp: 'signup',
    signIn: 'signin',
  },
  static: {
    img: {
      main: '',
    },
  },
  // Forums.
  f: {
    id: {
      __content__: '{0}',
      settingsRoot: 'settings',
      settings: {
        mods: '',
      },
    },
  },
  // Management X APIs (Admin).
  mx: {
    admins: '',
    forums: '',
  },
});

export function formatURL(url: string, params: Record<string, string>): string {
  let mURL = url;
  for (const [key, val] of Object.entries(params)) {
    mURL = mURL.replace(`:${key}`, val);
  }
  return mURL;
}
