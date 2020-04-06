import buildTree from 'fx214';

export default buildTree({
  m: {
    newPost: 'new-post',
    editPost: 'edit-post',
    editProfile: 'profile',
  },
  s: {
    // Service APIs
    r: {
      // Restricted (private) APIs
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
    },
    p: {
      // Public APIs
      cmt: {
        get: 'get',
      },
      auth: {
        createNewUser: 'create-pwd-user',
      },
    },
  },
  auth: {
    signUp: 'signup',
  },
  static: {
    img: {
      main: 'main',
    },
  },
});
