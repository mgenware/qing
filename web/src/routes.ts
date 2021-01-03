import buildTree from 'fx214';

export default buildTree({
  home: {
    newPost: 'new-post',
    newDiscussion: 'new-discussion',
    newQuestion: 'new-question',
    editPost: 'edit-post',
    yourPosts: 'your-posts',
    yourDiscussions: 'your-discussions',
    yourQuestion: 'your-questions',
    settings: {
      profile: 'profile',
      usersAndGroups: 'users-n-groups',
    },
  },
  // Service APIs.
  s: {
    pri: {
      reqCapt: 'req-capt',
      profile: {
        getInfo: 'get-info',
        setInfo: 'set-info',
        setAvatar: 'set-avatar',
        setBio: 'set-bio',
      },
      compose: {
        setPost: 'set-post',
        deletePost: 'delete-post',
        getPostSource: 'get-post-src',
        setCmt: 'set-cmt',
        getCmtSource: 'get-cmt-src',
        deleteCmt: 'delete-cmt',
      },
      auth: {
        signOut: 'signout',
      },
      like: {
        get: 'get',
        set: 'set',
      },
      // My posts.
      mp: {
        posts: 'posts',
        discussions: 'discussions',
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
        get: 'get',
      },
      auth: {
        createNewUser: 'create-pwd-user',
        signIn: 'signin',
      },
    },
    admin: {
      setAdmin: 'set-admin',
      getAdmins: 'get-admins',
    },
  },
  auth: {
    signUp: 'signup',
    signIn: 'signin',
  },
  static: {
    img: {
      main: 'main',
    },
  },
  // Forums.
  f: {
    id: {
      __content__: '{0}',
      settingsRoot: 'settings',
      settings: {
        mods: 'mods',
      },
    },
  },
});

export function formatURL(url: string, params: Record<string, string>): string {
  let mURL = url;
  for (const [key, val] of Object.entries(params)) {
    mURL = mURL.replace(`:${key}`, val);
  }
  return mURL;
}
